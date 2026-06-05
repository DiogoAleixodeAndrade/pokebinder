"use client";

import { useState, type ChangeEvent } from "react";
import type { PokemonCollectionItem } from "@/types/collection";
import { findPokemonFromScannedText } from "@/lib/cardScanner";

type CardScannerModalProps = {
  pokemonList: PokemonCollectionItem[];
  onClose: () => void;
  onSelectPokemon: (pokemon: PokemonCollectionItem) => void;
};

export function CardScannerModal({
  pokemonList,
  onClose,
  onSelectPokemon,
}: CardScannerModalProps) {
  const [imagePreview, setImagePreview] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [matchedPokemon, setMatchedPokemon] =
    useState<PokemonCollectionItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleScanImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setExtractedText("");
    setMatchedPokemon(null);
    setProgress(0);

    try {
      setIsScanning(true);

      const Tesseract = await import("tesseract.js");

      const result = await Tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setProgress(Math.round(message.progress * 100));
          }
        },
      });

      const text = result.data.text || "";
      const pokemon = findPokemonFromScannedText(text, pokemonList);

      setExtractedText(text);
      setMatchedPokemon(pokemon);
    } catch (error) {
      console.error("Erro ao escanear carta:", error);
      alert("Não consegui ler a imagem. Tente uma foto mais clara da carta.");
    } finally {
      setIsScanning(false);
      event.target.value = "";
    }
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/80">
        <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-500">Scanner de carta</p>
            <h2 className="mt-1 text-3xl font-black text-white">
              Identificar Pokémon
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Envie uma foto da carta para tentar detectar o nome do Pokémon.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-fit rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-400/50 hover:text-red-300"
          >
            Fechar
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[360px_1fr]">
          <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-4">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-yellow-400/30 bg-yellow-400/10 p-6 text-center transition hover:bg-yellow-400/15">
              <div className="text-4xl">📷</div>
              <p className="mt-3 text-sm font-black text-yellow-300">
                Enviar foto da carta
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                Use uma imagem nítida, com o nome da carta bem visível.
              </p>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleScanImage}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
                <img
                  src={imagePreview}
                  alt="Carta enviada"
                  className="mx-auto max-h-[420px] rounded-xl object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {isScanning && (
              <div className="rounded-[1.5rem] border border-yellow-400/25 bg-yellow-400/10 p-5">
                <p className="text-sm font-bold text-yellow-300">
                  Lendo imagem... {progress}%
                </p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {!isScanning && matchedPokemon && (
              <div className="rounded-[1.5rem] border border-emerald-400/25 bg-emerald-400/10 p-5">
                <p className="text-sm text-emerald-300">
                  Pokémon identificado
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  {matchedPokemon.name}
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  {matchedPokemon.formType} • Gen {matchedPokemon.generation}
                </p>

                <button
                  type="button"
                  onClick={() => onSelectPokemon(matchedPokemon)}
                  className="premium-button mt-5 rounded-2xl px-5 py-3 text-sm"
                >
                  Usar este Pokémon
                </button>
              </div>
            )}

            {!isScanning && extractedText && !matchedPokemon && (
              <div className="rounded-[1.5rem] border border-red-400/25 bg-red-400/10 p-5">
                <p className="text-sm font-bold text-red-300">
                  Não consegui identificar automaticamente.
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Tente uma foto mais clara ou cadastre manualmente.
                </p>
              </div>
            )}

            {extractedText && (
              <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-5">
                <p className="text-sm font-bold text-zinc-300">
                  Texto encontrado na imagem
                </p>

                <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs leading-5 text-zinc-400">
                  {extractedText}
                </pre>
              </div>
            )}

            {!imagePreview && !isScanning && (
              <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-5">
                <p className="text-sm font-bold text-zinc-300">
                  Dica para funcionar melhor
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Tire a foto de frente, com boa luz, sem reflexo e com o nome
                  da carta aparecendo bem.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}