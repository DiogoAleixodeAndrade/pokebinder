import { useMemo, useState } from "react";
import type { PokemonCollectionItem } from "@/types/collection";
import { getPokemonArtworkUrl } from "@/lib/pokemonArtwork";

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

  const totalPages = Math.max(1, Math.ceil(pokemonList.length / ITEMS_PER_PAGE));

  const currentItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return pokemonList.slice(start, start + ITEMS_PER_PAGE);
  }, [page, pokemonList]);

  return (
    <div className="p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-black text-white">Visão Binder 4x4</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Página {page} de {totalPages} • 16 espaços por página
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-300 disabled:opacity-40"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-300 disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {currentItems.map((pokemon) => {
            const showCard = pokemon.owned && pokemon.cardImageUrl;
            const artworkUrl = getPokemonArtworkUrl(pokemon.dexNumber);

            return (
              <button
                key={pokemon.id}
                type="button"
                onClick={() => onEdit(pokemon)}
                className="group overflow-hidden rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-3 text-left shadow-lg transition hover:scale-[1.01] hover:border-yellow-400/40"
              >
                <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                  {showCard ? (
                    <img
                      src={pokemon.cardImageUrl}
                      alt={pokemon.selectedCard || pokemon.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <>
                      <img
                        src={artworkUrl}
                        alt={pokemon.name}
                        className="h-full w-full object-contain p-4 opacity-80"
                      />

                      <div className="absolute inset-0 bg-black/25" />

                      <div className="absolute left-2 top-2 rounded-full border border-red-400/30 bg-red-400/15 px-2 py-1 text-[10px] font-bold text-red-300">
                        Faltando
                      </div>
                    </>
                  )}

                  {pokemon.owned && (
                    <div className="absolute right-2 top-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-300">
                      Tenho
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p className="line-clamp-1 text-sm font-black text-white">
                    {pokemon.name}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-300">
                      #{String(pokemon.dexNumber).padStart(3, "0")}
                    </span>

                    <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-400">
                      Gen {pokemon.generation}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-1 text-[10px] text-zinc-500">
                    {pokemon.formType}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}