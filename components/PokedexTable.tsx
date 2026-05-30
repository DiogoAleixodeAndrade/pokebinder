"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { PokemonCollectionItem } from "@/types/collection";
import { StatusBadge } from "@/components/ui/StatusBadge";

type PokedexTableProps = {
  pokemonList: PokemonCollectionItem[];
  onEdit: (pokemon: PokemonCollectionItem) => void;
  formatCurrency: (value: number) => string;
};

type PreviewPosition = {
  x: number;
  y: number;
};

export function PokedexTable({
  pokemonList,
  onEdit,
  formatCurrency,
}: PokedexTableProps) {
  const [previewPokemon, setPreviewPokemon] =
    useState<PokemonCollectionItem | null>(null);

  const [previewPosition, setPreviewPosition] = useState<PreviewPosition>({
    x: 0,
    y: 0,
  });

  const [isMounted, setIsMounted] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function showPreview(
    element: HTMLButtonElement,
    pokemon: PokemonCollectionItem
  ) {
    const rect = element.getBoundingClientRect();

    const previewWidth = 320;
    const previewHeight = 500;
    const gap = 18;

    let x = rect.right + gap;
    let y = rect.top - 80;

    if (x + previewWidth > window.innerWidth) {
      x = rect.left - previewWidth - gap;
    }

    if (y + previewHeight > window.innerHeight) {
      y = window.innerHeight - previewHeight - gap;
    }

    if (y < gap) {
      y = gap;
    }

    setImageFailed(false);
    setPreviewPokemon(pokemon);
    setPreviewPosition({ x, y });
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/60 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <th className="px-6 py-5">ID</th>
              <th className="px-6 py-5">Pokémon/Forma</th>
              <th className="px-6 py-5">Tipo</th>
              <th className="px-6 py-5">Carta selecionada</th>
              <th className="px-6 py-5">Preço</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Ações</th>
            </tr>
          </thead>

          <tbody>
            {pokemonList.map((pokemon) => (
              <tr
                key={pokemon.id}
                className="group border-b border-zinc-800/70 transition hover:bg-yellow-400/[0.035]"
              >
                <td className="px-6 py-5 text-sm font-semibold text-zinc-500">
                  #{String(pokemon.id).padStart(4, "0")}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {pokemon.cardImageUrl ? (
                      <button
                        type="button"
                        onMouseEnter={(event) =>
                          showPreview(event.currentTarget, pokemon)
                        }
                        onMouseLeave={() => setPreviewPokemon(null)}
                        onFocus={(event) =>
                          showPreview(event.currentTarget, pokemon)
                        }
                        onBlur={() => setPreviewPokemon(null)}
                        onClick={() => onEdit(pokemon)}
                        className="h-14 w-10 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-lg transition hover:border-yellow-400/60"
                        aria-label={`Abrir ${pokemon.name}`}
                      >
                        <img
                          src={pokemon.cardImageUrl}
                          alt={pokemon.selectedCard || pokemon.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onEdit(pokemon)}
                        className="flex h-14 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950 text-[10px] font-bold text-zinc-500 shadow-lg transition hover:border-yellow-400/60"
                        aria-label={`Abrir ${pokemon.name}`}
                      >
                        Sem
                      </button>
                    )}

                    <div>
                      <button
                        type="button"
                        onClick={() => onEdit(pokemon)}
                        className="text-left font-bold text-zinc-100 transition hover:text-yellow-200"
                      >
                        {pokemon.name}
                      </button>

                      {pokemon.notes && (
                        <p className="mt-1 max-w-xs truncate text-xs text-zinc-500">
                          {pokemon.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1 text-xs font-semibold text-zinc-300">
                    {pokemon.formType}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="max-w-xs">
                    <p
                      className={`truncate text-sm ${
                        pokemon.selectedCard ? "text-zinc-200" : "text-zinc-500"
                      }`}
                    >
                      {pokemon.selectedCard || "Ainda não selecionado"}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm font-black text-yellow-300">
                    {pokemon.lowestPrice > 0
                      ? formatCurrency(pokemon.lowestPrice)
                      : "-"}
                  </p>
                </td>

                <td className="px-6 py-5">
                  {pokemon.owned ? (
                    <StatusBadge status="Adquirido" variant="owned" />
                  ) : pokemon.selectedCard ? (
                    <StatusBadge status="Selecionado" variant="selected" />
                  ) : (
                    <StatusBadge status="Pendente" variant="pending" />
                  )}
                </td>

                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(pokemon)}
                      className="premium-button rounded-2xl px-4 py-2.5 text-sm"
                    >
                      Editar
                    </button>

                    {pokemon.ligaPokemonUrl && (
                      <a
                        href={pokemon.ligaPokemonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-2.5 text-sm font-bold text-zinc-300 transition hover:border-yellow-400/50 hover:text-yellow-300"
                      >
                        Liga
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pokemonList.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto max-w-md rounded-[1.5rem] border border-zinc-800 bg-zinc-950/60 p-8">
              <p className="text-lg font-bold text-zinc-300">
                Nenhum Pokémon encontrado
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Tente limpar os filtros ou buscar por outro nome.
              </p>
            </div>
          </div>
        )}
      </div>

      {isMounted &&
        previewPokemon?.cardImageUrl &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[999999] w-[320px] rounded-[1.5rem] border border-yellow-400/40 bg-zinc-950 p-3 shadow-2xl shadow-black/80"
            style={{
              left: previewPosition.x,
              top: previewPosition.y,
            }}
          >
            {!imageFailed ? (
              <img
                src={previewPokemon.cardImageUrl}
                alt={previewPokemon.selectedCard || previewPokemon.name}
                onError={() => setImageFailed(true)}
                className="mx-auto max-h-[440px] w-full rounded-2xl object-contain"
              />
            ) : (
              <div className="flex h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-red-400/30 bg-red-400/10 p-4 text-center">
                <p className="text-sm font-bold text-red-300">
                  Não consegui carregar essa imagem.
                </p>
                <p className="mt-2 text-xs text-red-200/70">
                  A URL pode estar bloqueando visualização fora do site original.
                </p>
              </div>
            )}

            <div className="mt-3 text-center">
              <p className="text-sm font-black text-white">
                {previewPokemon.selectedCard || previewPokemon.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {previewPokemon.name}
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}