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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10 text-white">
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

      <section className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="premium-card overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-8">
            <div>
              <span className="w-fit rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-sm font-semibold text-yellow-300">
                Pokémon TCG Collection Tracker
              </span>

              <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-3xl border border-yellow-400/30 bg-yellow-400/10 text-3xl shadow-2xl shadow-yellow-950/30">
                ⚡
              </div>

              <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-7xl">
                Poké<span className="text-yellow-300">Binder</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                Seu binder digital premium para controlar cartas Pokémon TCG,
                acompanhar progresso, importar sua coleção e salvar tudo online.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <FeatureCard title="Pokédex completa" description="Formas, Megas e Gigantamax" />
              <FeatureCard title="Coleção online" description="Salva com Supabase" />
              <FeatureCard title="Importação" description="Planilha, CSV ou TXT" />
            </div>

            <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="text-sm font-bold text-zinc-200">
                Feito para colecionadores
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Marque quais Pokémon você já possui, escolha a carta desejada,
                salve preço, link da Liga Pokémon e imagem do card.
              </p>
            </div>
          </div>
        </div>

        <div className="premium-card rounded-[2rem] p-6 shadow-2xl md:p-8">
          <div className="mb-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-sm font-semibold text-yellow-300">
                Acesso
              </span>

              <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-4 py-1.5 text-xs text-zinc-400">
                Supabase Auth
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight">
              {mode === "login" ? "Entrar na coleção" : "Criar sua conta"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {mode === "login"
                ? "Acesse sua coleção e continue de onde parou."
                : "Crie uma conta para salvar sua coleção na nuvem."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-white px-4 py-3.5 text-sm font-black text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-xs font-black text-white">
              G
            </span>
            {isGoogleLoading ? "Abrindo Google..." : "Entrar com Google"}
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs font-semibold text-zinc-500">ou</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-zinc-300">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seuemail@email.com"
                className="premium-input rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-500"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-zinc-300">Senha</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="premium-input rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-500"
              />
            </label>

            {message && (
              <p className="rounded-2xl border border-zinc-700 bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-300">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="premium-button rounded-2xl px-4 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
            className="mt-4 w-full rounded-2xl border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-yellow-400/50 hover:text-yellow-300"
          >
            {mode === "login"
              ? "Ainda não tenho conta"
              : "Já tenho conta"}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-zinc-600">
            Ao continuar, sua coleção será vinculada à sua conta para acesso em
            qualquer dispositivo.
          </p>
        </div>
      </section>
    </main>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="mb-3 h-2 w-10 rounded-full bg-yellow-400" />
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
    </div>
  );
}