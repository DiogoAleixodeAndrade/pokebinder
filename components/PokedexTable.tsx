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
  function getDifference(pokemon: PokemonCollectionItem) {
    return Number(pokemon.marketPrice || 0) - Number(pokemon.purchasePrice || 0);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] border-collapse text-left">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-950/60 text-xs uppercase tracking-[0.18em] text-zinc-500">
            <th className="px-6 py-5">ID</th>
            <th className="px-6 py-5">Pokémon/Forma</th>
            <th className="px-6 py-5">Tipo</th>
            <th className="px-6 py-5">Carta</th>
            <th className="px-6 py-5">Pago</th>
            <th className="px-6 py-5">Valor NM</th>
            <th className="px-6 py-5">Diferença</th>
            <th className="px-6 py-5">Status</th>
            <th className="sticky right-0 z-20 bg-zinc-950/95 px-6 py-5 text-right">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {pokemonList.map((pokemon) => {
            const difference = getDifference(pokemon);
            const hasDifference =
              Number(pokemon.purchasePrice || 0) > 0 &&
              Number(pokemon.marketPrice || 0) > 0;

            return (
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

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(pokemon)}
                        className="w-fit text-left font-bold text-zinc-100 transition hover:text-yellow-200"
                      >
                        {pokemon.name}
                      </button>

                      {pokemon.notes && (
                        <p className="max-w-xs truncate text-xs text-zinc-500">
                          {pokemon.notes}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => onEdit(pokemon)}
                        className="w-fit rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-1.5 text-xs font-bold text-yellow-300 transition hover:bg-yellow-400/15"
                      >
                        Editar carta
                      </button>
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
                      className={`truncate text-sm ${pokemon.selectedCard ? "text-zinc-200" : "text-zinc-500"
                        }`}
                    >
                      {pokemon.selectedCard || "Ainda não selecionado"}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm font-black text-zinc-200">
                    {pokemon.purchasePrice > 0
                      ? formatCurrency(pokemon.purchasePrice)
                      : "-"}
                  </p>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm font-black text-yellow-300">
                    {pokemon.marketPrice > 0
                      ? formatCurrency(pokemon.marketPrice)
                      : "-"}
                  </p>
                  {pokemon.marketUpdatedAt && (
                    <p className="mt-1 text-[10px] text-zinc-500">
                      Atualizado
                    </p>
                  )}
                </td>

                <td className="px-6 py-5">
                  <p
                    className={`text-sm font-black ${!hasDifference
                      ? "text-zinc-500"
                      : difference >= 0
                        ? "text-emerald-300"
                        : "text-red-300"
                      }`}
                  >
                    {hasDifference
                      ? `${difference >= 0 ? "+" : "-"}${formatCurrency(
                        Math.abs(difference)
                      )}`
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

                <td className="sticky right-0 z-10 bg-zinc-950/95 px-6 py-5">
                  <div className="flex justify-end gap-2">
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
                        Fonte
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
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
  );
}