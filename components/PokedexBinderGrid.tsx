"use client";

import { useEffect, useMemo, useState } from "react";
import type { PokemonCollectionItem } from "@/types/collection";
import { getPokemonArtworkCandidates } from "@/lib/pokemonArtwork";
import {
  getCardSearchQuery,
  getLigaPokemonSearchUrl,
  getMyPcardsSearchUrl,
  getTcgPlayerSearchUrl,
} from "@/lib/cardSources";

type PokedexBinderGridProps = {
  pokemonList: PokemonCollectionItem[];
  onEdit: (pokemon: PokemonCollectionItem) => void;
};

const ITEMS_PER_PAGE = 16;

export function PokedexBinderGrid({
  pokemonList,
  onEdit,
}: PokedexBinderGridProps) {
  const [page, setPage] = useState(1);
  const [mobileLayout, setMobileLayout] = useState<"compact" | "large">(
    "compact"
  );
  const [binderMode, setBinderMode] = useState<"control" | "showcase">(
    "control"
  );

  const [showOnlyOwned, setShowOnlyOwned] = useState(false);

  const [hideEmptySlots, setHideEmptySlots] = useState(false);

  const binderItems = useMemo(() => {
  if (!showOnlyOwned) return pokemonList;

  return pokemonList.filter((pokemon) => pokemon.owned);
}, [pokemonList, showOnlyOwned]);

const totalPages = Math.max(1, Math.ceil(binderItems.length / ITEMS_PER_PAGE));

const currentItems = useMemo(() => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return binderItems.slice(start, start + ITEMS_PER_PAGE);
}, [page, binderItems]);

  const emptySlots = hideEmptySlots
  ? []
  : Array.from({
      length: Math.max(0, ITEMS_PER_PAGE - currentItems.length),
    });

  useEffect(() => {
  setPage(1);
}, [pokemonList, showOnlyOwned]);

  return (
    <div className="p-4 md:p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-black text-white">Binder 4x4</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Página {page} de {totalPages} • {binderItems.length} itens
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-sm font-black text-yellow-300">
              {page}/{totalPages}
            </div>

            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </div>

          <div className="flex w-fit rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-1 md:hidden">
            <button
              type="button"
              onClick={() => setMobileLayout("compact")}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                mobileLayout === "compact"
                  ? "bg-yellow-400 text-zinc-950"
                  : "text-zinc-400"
              }`}
            >
              2 colunas
            </button>

            <button
              type="button"
              onClick={() => setMobileLayout("large")}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                mobileLayout === "large"
                  ? "bg-yellow-400 text-zinc-950"
                  : "text-zinc-400"
              }`}
            >
              Grande
            </button>
          </div>

          <div className="flex w-fit rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-1">
            <button
              type="button"
              onClick={() => {
  setBinderMode("control");
  setHideEmptySlots(false);
}}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                binderMode === "control"
                  ? "bg-yellow-400 text-zinc-950"
                  : "text-zinc-400"
              }`}
            >
              Controle
            </button>

            <button
              type="button"
              onClick={() => {
  setBinderMode("showcase");
  setHideEmptySlots(true);
}}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                binderMode === "showcase"
                  ? "bg-yellow-400 text-zinc-950"
                  : "text-zinc-400"
              }`}
            >
              Exposição
            </button>

            <button
  type="button"
  onClick={() => setShowOnlyOwned((current) => !current)}
  className={`w-fit rounded-2xl border px-4 py-2 text-sm font-black transition ${
    showOnlyOwned
      ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
      : "border-zinc-700 bg-zinc-950/70 text-zinc-400 hover:text-white"
  }`}
>
  {showOnlyOwned ? "Só adquiridos: ON" : "Só adquiridos"}
</button>

<button
  type="button"
  onClick={() => setHideEmptySlots((current) => !current)}
  className={`w-fit rounded-2xl border px-4 py-2 text-sm font-black transition ${
    hideEmptySlots
      ? "border-sky-400/40 bg-sky-400/15 text-sky-300"
      : "border-zinc-700 bg-zinc-950/70 text-zinc-400 hover:text-white"
  }`}
>
  {hideEmptySlots ? "Vazios ocultos: ON" : "Ocultar vazios"}
</button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 p-3 shadow-2xl shadow-black/40 md:rounded-[2.25rem] md:p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_45%)]" />

        <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-14 border-r border-zinc-800/80 bg-zinc-950/80 md:block">
          <div className="flex h-full flex-col items-center justify-around py-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-5 w-5 rounded-full border border-zinc-700 bg-zinc-900 shadow-inner"
              />
            ))}
          </div>
        </div>

        <div className="relative rounded-[1.25rem] border border-zinc-800/80 bg-zinc-900/45 p-2 md:ml-10 md:rounded-[1.75rem] md:p-4">
          <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-white/[0.025] md:rounded-[1.75rem]" />

          <div
            className={`relative grid gap-3 md:gap-4 xl:grid-cols-4 ${
              mobileLayout === "large" ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {binderItems.length === 0 && (
  <div className="col-span-full rounded-[1.5rem] border border-dashed border-zinc-800 bg-zinc-950/70 p-8 text-center">
    <p className="text-lg font-black text-zinc-300">
      Nenhum item para exibir
    </p>
    <p className="mt-2 text-sm text-zinc-500">
      Desative o filtro “Só adquiridos” ou marque alguma carta como adquirida.
    </p>
  </div>
)}
            {currentItems.map((pokemon) => {
              const showCard = pokemon.owned && pokemon.cardImageUrl;
              const query = getCardSearchQuery(
                pokemon.selectedCard,
                pokemon.name
              );

              const ligaPokemonUrl = getLigaPokemonSearchUrl(query);
              const myPcardsUrl = getMyPcardsSearchUrl(query);
              const tcgPlayerUrl = getTcgPlayerSearchUrl(query);

              return (
                <article
                  key={pokemon.id}
                  className={`group rounded-[1.1rem] border border-white/10 bg-white/[0.045] p-1.5 shadow-inner shadow-white/5 transition hover:border-yellow-400/40 hover:bg-yellow-400/[0.035] md:rounded-[1.5rem] md:p-2 ${
                    binderMode === "showcase" ? "hover:scale-[1.01]" : ""
                  }`}
                >
                  <div className="rounded-[1rem] border border-zinc-800 bg-zinc-950/85 p-2 shadow-lg shadow-black/30 md:rounded-[1.35rem]">
                    <button
                      type="button"
                      onClick={() => onEdit(pokemon)}
                      className="block w-full text-left"
                    >
                      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-80" />

                        {showCard ? (
                          <img
                            src={pokemon.cardImageUrl}
                            alt={pokemon.selectedCard || pokemon.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <>
                            <PokemonArtworkFallback
                              name={pokemon.name}
                              dexNumber={pokemon.dexNumber}
                            />

                            <div className="absolute inset-0 bg-black/20" />

                            {binderMode === "control" && (
                              <div className="absolute left-2 top-2 z-30 rounded-full border border-red-400/30 bg-red-400/15 px-2 py-1 text-[9px] font-bold text-red-300 md:text-[10px]">
                                Faltando
                              </div>
                            )}
                          </>
                        )}

                        {pokemon.owned && binderMode === "control" && (
                          <div className="absolute right-2 top-2 z-30 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-1 text-[9px] font-bold text-emerald-300 md:text-[10px]">
                            Tenho
                          </div>
                        )}
                      </div>

                      <div
                        className={
                          binderMode === "showcase"
                            ? "mt-3 text-center"
                            : "mt-3"
                        }
                      >
                        <p className="line-clamp-1 text-sm font-black text-white md:text-base">
                          {pokemon.name}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                          {pokemon.selectedCard || "Sem carta selecionada"}
                        </p>

                        <div
                          className={`mt-2 flex flex-wrap gap-1.5 md:gap-2 ${
                            binderMode === "showcase"
                              ? "justify-center"
                              : "justify-start"
                          }`}
                        >
                          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-300">
                            #{String(pokemon.dexNumber).padStart(3, "0")}
                          </span>

                          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-400">
                            Gen {pokemon.generation}
                          </span>
                        </div>

                        {binderMode === "control" && (
                          <p className="mt-2 line-clamp-1 text-[10px] text-zinc-500">
                            {pokemon.formType}
                          </p>
                        )}
                      </div>
                    </button>

                    {binderMode === "control" && (
                      <div
                        className={`mt-3 grid gap-1.5 md:grid-cols-3 md:gap-2 ${
                          mobileLayout === "large"
                            ? "grid-cols-3"
                            : "grid-cols-2"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onEdit(pokemon)}
                          className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-2 py-2 text-[10px] font-bold text-yellow-300 transition hover:bg-yellow-400/15"
                        >
                          Edit
                        </button>

                        {pokemon.ligaPokemonUrl ? (
                          <a
                            href={pokemon.ligaPokemonUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-2 text-center text-[10px] font-bold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-300"
                          >
                            Fonte
                          </a>
                        ) : (
                          <span className="rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-2 text-center text-[10px] font-bold text-zinc-600">
                            Fonte
                          </span>
                        )}

                        <a
                          href={ligaPokemonUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-2 py-2 text-center text-[10px] font-bold text-yellow-300 transition hover:bg-yellow-400/15"
                        >
                          Liga
                        </a>

                        <a
                          href={myPcardsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-2 py-2 text-center text-[10px] font-bold text-cyan-300 transition hover:bg-cyan-400/15"
                        >
                          MyP
                        </a>

                        <a
                          href={tcgPlayerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-purple-400/30 bg-purple-400/10 px-2 py-2 text-center text-[10px] font-bold text-purple-300 transition hover:bg-purple-400/15"
                        >
                          TCG
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            {emptySlots.map((_, index) => (
              <div
                key={`empty-${index}`}
                className="rounded-[1.1rem] border border-white/10 bg-white/[0.035] p-1.5 shadow-inner shadow-white/5 md:rounded-[1.5rem] md:p-2"
              >
                <div className="flex min-h-[240px] items-center justify-center rounded-[1rem] border border-dashed border-zinc-800 bg-zinc-950/65 p-4 text-center md:min-h-[320px] md:rounded-[1.35rem]">
                  <div>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-xl">
                      🃏
                    </div>

                    <p className="text-xs font-bold text-zinc-600">
                      Espaço vazio
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
      className="relative z-10 h-full w-full object-contain p-3 opacity-85 md:p-4"
    />
  );
}