"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";

export function AuthScreen() {
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage("");

      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setMessage(
          "Cadastro criado. Se o Supabase pedir confirmação, confirme pelo e-mail antes de entrar."
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao autenticar. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setIsGoogleLoading(true);
      setMessage("");

      await signInWithGoogle();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao entrar com Google. Tente novamente."
      );
      setIsGoogleLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-6">
          <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-sm text-yellow-300">
            PokéBinder
          </span>

          <h1 className="mt-4 text-3xl font-bold">
            {mode === "login" ? "Entrar na coleção" : "Criar conta"}
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Salve sua coleção Pokémon TCG online e acesse de qualquer lugar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-white px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
            G
          </span>
          {isGoogleLoading ? "Abrindo Google..." : "Entrar com Google"}
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-500">ou</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seuemail@email.com"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">Senha</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
            />
          </label>

          {message && (
            <p className="rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-300">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Aguarde..."
              : mode === "login"
                ? "Entrar"
                : "Cadastrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((currentMode) =>
              currentMode === "login" ? "register" : "login"
            );
            setMessage("");
          }}
          className="mt-4 w-full rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-300 hover:border-yellow-400 hover:text-yellow-300"
        >
          {mode === "login"
            ? "Ainda não tenho conta"
            : "Já tenho conta"}
        </button>
      </section>
    </main>
  );
}