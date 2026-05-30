"use client";

import { useState } from "react";
import type { PokemonCollectionItem } from "@/types/collection";
import { StatusBadge } from "@/components/ui/StatusBadge";

type PokedexTableProps = {
  pokemonList: PokemonCollectionItem[];
  onEdit: (pokemon: PokemonCollectionItem) => void;
  formatCurrency: (value: number) => string;
};

export function PokedexTable({
  pokemonList,
  onEdit,
  formatCurrency,
}: PokedexTableProps) {
  const [previewPokemon, setPreviewPokemon] =
    useState<PokemonCollectionItem | null>(null);

  return (
    <div className="relative">
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
                        onMouseEnter={() => setPreviewPokemon(pokemon)}
                        onMouseLeave={() => setPreviewPokemon(null)}
                        className="h-14 w-10 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-lg transition hover:border-yellow-400/60"
                        aria-label={`Prévia de ${pokemon.name}`}
                      >
                        <img
                          src={pokemon.cardImageUrl}
                          alt={pokemon.selectedCard || pokemon.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="flex h-14 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950 text-[10px] font-bold text-zinc-500 shadow-lg">
                        Sem
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-zinc-100 transition group-hover:text-yellow-200">
                        {pokemon.name}
                      </p>

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

      {previewPokemon?.cardImageUrl && (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

          <div className="premium-card relative w-full max-w-[340px] rounded-[2rem] border-yellow-400/30 p-4 shadow-2xl shadow-black/70">
            <img
              src={previewPokemon.cardImageUrl}
              alt={previewPokemon.selectedCard || previewPokemon.name}
              className="mx-auto max-h-[500px] w-full rounded-2xl object-contain"
            />

            <div className="mt-4 text-center">
              <p className="text-sm font-black text-white">
                {previewPokemon.selectedCard || previewPokemon.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {previewPokemon.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}