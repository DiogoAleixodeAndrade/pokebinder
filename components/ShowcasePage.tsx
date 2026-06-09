"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getInitialCollectionState,
  loadCollectionFromStorage,
} from "@/lib/collection";
import { pokemonForms } from "@/data/pokemonForms";
import { getPokemonArtworkCandidates } from "@/lib/pokemonArtwork";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getCollectionItemsFromSupabase } from "@/lib/supabase/collectionItems";
import type { CollectionState, PokemonCollectionItem } from "@/types/collection";

const DEFAULT_ITEMS_PER_PAGE = 12;
const PRINT_ITEMS_PER_PAGE = 9;

export function ShowcasePage() {
  const [collection, setCollection] = useState<CollectionState>(() =>
    getInitialCollectionState()
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [printMode, setPrintMode] = useState(false);

  const itemsPerPage = printMode ? PRINT_ITEMS_PER_PAGE : DEFAULT_ITEMS_PER_PAGE;

  useEffect(() => {
    async function loadCollection() {
      setIsLoading(true);

      const localCollection = loadCollectionFromStorage();

      if (localCollection) {
        setCollection(localCollection);
      }

      try {
        const user = await getCurrentUser();

        if (!user) return;

        const supabaseCollection = await getCollectionItemsFromSupabase(user.id);

        setCollection((currentCollection) => ({
          ...currentCollection,
          ...supabaseCollection,
        }));
      } catch (error) {
        console.error("Erro ao carregar coleção no showcase:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCollection();
  }, []);

  const ownedPokemon = useMemo<PokemonCollectionItem[]>(() => {
    return pokemonForms
      .map((pokemon) => ({
        ...pokemon,
        ...collection[pokemon.id],
      }))
      .filter((pokemon) => pokemon.owned);
  }, [collection]);

  const totalPages = Math.max(
    1,
    Math.ceil(ownedPokemon.length / itemsPerPage)
  );

  const currentItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
return ownedPokemon.slice(start, start + itemsPerPage);
  }, [ownedPokemon, page, itemsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [ownedPokemon.length]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className={`mx-auto flex w-full max-w-6xl flex-col px-4 md:px-8 ${
    printMode ? "gap-4 py-4" : "gap-6 py-6 md:py-10"
  }`}>
        {!printMode && (
        <header className="rounded-[1.75rem] border border-yellow-400/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 shadow-2xl shadow-black/50 md:rounded-[2rem] md:p-8">
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

            <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
              <a
                href="/"
                className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-300"
              >
                Voltar
              </a>

              <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/10 px-5 py-3 md:py-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300/80">
                  Cartas
                </p>
                <strong className="mt-1 block text-2xl font-black text-yellow-300 md:text-3xl">
                  {ownedPokemon.length}
                </strong>
              </div>
            </div>
          </div>
        </header>
        )}

        <div className="flex flex-col gap-3 rounded-[1.75rem] border border-zinc-800 bg-zinc-900/50 p-4 md:flex-row md:items-center md:justify-between md:rounded-[2rem]">
          <p className="text-sm text-zinc-400">
            Página {page} de {totalPages}
          </p>

          <button
  type="button"
  onClick={() => setPrintMode((current) => !current)}
  className={`rounded-2xl border px-4 py-2 text-sm font-bold transition ${
    printMode
      ? "border-yellow-400/40 bg-yellow-400/15 text-yellow-300"
      : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-yellow-400/40 hover:text-yellow-300"
  }`}
>
  {printMode ? "Sair do print" : "Modo print"}
</button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 md:flex-none"
            >
              Anterior
            </button>

            <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-sm font-black text-yellow-300">
              {page}/{totalPages}
            </div>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page === totalPages}
              className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 md:flex-none"
            >
              Próxima
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/40 p-8 text-center">
            <p className="text-lg font-black text-zinc-300">
              Carregando sua coleção...
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Buscando cartas salvas no PokéBinder.
            </p>
          </div>
        )}

        {!isLoading && ownedPokemon.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-zinc-800 bg-zinc-900/40 p-10 text-center">
            <p className="text-xl font-black text-zinc-300">
              Nenhuma carta adquirida ainda
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Volte para a Pokédex e marque algumas cartas como adquiridas.
            </p>

            <a
              href="/"
              className="mt-6 inline-flex rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-400/15"
            >
              Voltar para Pokédex
            </a>
          </div>
        ) : (
          !isLoading && (
            <div
  className={`grid gap-4 ${
    printMode ? "grid-cols-1 sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"
  }`}
>
              {currentItems.map((pokemon) => (
                <ShowcaseCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          )
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
    <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/30 md:rounded-[2rem]">
      <div className="rounded-[1.35rem] border border-zinc-800 bg-zinc-950 p-3 md:rounded-[1.5rem]">
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

function PokemonArtworkFallback({
  name,
  dexNumber,
}: PokemonArtworkFallbackProps) {
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