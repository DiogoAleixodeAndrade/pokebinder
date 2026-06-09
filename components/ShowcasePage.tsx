"use client";

import { useEffect, useMemo, useState } from "react";
import { getInitialCollectionState, loadCollectionFromStorage } from "@/lib/collection";
import { pokemonForms } from "@/data/pokemonForms";
import { getPokemonArtworkCandidates } from "@/lib/pokemonArtwork";
import type { CollectionState, PokemonCollectionItem } from "@/types/collection";

const ITEMS_PER_PAGE = 12;

export function ShowcasePage() {
  const [collection, setCollection] = useState<CollectionState>(() =>
    getInitialCollectionState()
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    const localCollection = loadCollectionFromStorage();

    if (localCollection) {
      setCollection(localCollection);
    }
  }, []);

  const ownedPokemon = useMemo<PokemonCollectionItem[]>(() => {
    return pokemonForms
      .map((pokemon) => ({
        ...pokemon,
        ...collection[pokemon.id],
      }))
      .filter((pokemon) => pokemon.owned);
  }, [collection]);

  const totalPages = Math.max(1, Math.ceil(ownedPokemon.length / ITEMS_PER_PAGE));

  const currentItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return ownedPokemon.slice(start, start + ITEMS_PER_PAGE);
  }, [ownedPokemon, page]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
        <header className="rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 shadow-2xl shadow-black/50 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 text-2xl">
                ⚡
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Minha coleção
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                Binder de cartas adquiridas no PokéBinder.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/10 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300/80">
                Cartas
              </p>
              <strong className="mt-1 block text-3xl font-black text-yellow-300">
                {ownedPokemon.length}
              </strong>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-3 rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-400">
            Página {page} de {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-bold text-zinc-300 disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page === totalPages}
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-bold text-zinc-300 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>

        {ownedPokemon.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-zinc-800 bg-zinc-900/40 p-10 text-center">
            <p className="text-xl font-black text-zinc-300">
              Nenhuma carta adquirida ainda
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Volte para a Pokédex e marque algumas cartas como adquiridas.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((pokemon) => (
              <ShowcaseCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

type ShowcaseCardProps = {
  pokemon: PokemonCollectionItem;
};

function ShowcaseCard({ pokemon }: ShowcaseCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/30">
      <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-3">
        <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[1.25rem] border border-zinc-800 bg-zinc-950">
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/10 via-transparent to-black/20" />

          {pokemon.cardImageUrl ? (
            <img
              src={pokemon.cardImageUrl}
              alt={pokemon.selectedCard || pokemon.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <PokemonArtworkFallback
              name={pokemon.name}
              dexNumber={pokemon.dexNumber}
            />
          )}
        </div>

        <div className="mt-4 text-center">
          <h2 className="line-clamp-1 text-xl font-black text-white">
            {pokemon.name}
          </h2>

          <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
            {pokemon.selectedCard || "Carta adquirida"}
          </p>

          <div className="mt-3 flex justify-center gap-2">
            <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
              #{String(pokemon.dexNumber).padStart(3, "0")}
            </span>

            <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300">
              Tenho
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

type PokemonArtworkFallbackProps = {
  name: string;
  dexNumber: number;
};

function PokemonArtworkFallback({ name, dexNumber }: PokemonArtworkFallbackProps) {
  const candidates = useMemo(
    () => getPokemonArtworkCandidates(name, dexNumber),
    [name, dexNumber]
  );

  const [imageIndex, setImageIndex] = useState(0);

  const currentImage = candidates[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [name, dexNumber]);

  return (
    <img
      src={currentImage}
      alt={name}
      onError={() => {
        setImageIndex((currentIndex) => {
          const nextIndex = currentIndex + 1;

          if (nextIndex >= candidates.length) {
            return currentIndex;
          }

          return nextIndex;
        });
      }}
      className="relative z-10 h-full w-full object-contain p-5 opacity-90"
    />
  );
}