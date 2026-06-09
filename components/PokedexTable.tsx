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
  function getCurrentMarketPrice(pokemon: PokemonCollectionItem) {
    return Number(
      pokemon.averageMarketPrice ||
        pokemon.marketPrice ||
        pokemon.lowestPrice ||
        0
    );
  }

  function getDifference(pokemon: PokemonCollectionItem) {
    return getCurrentMarketPrice(pokemon) - Number(pokemon.purchasePrice || 0);
  }

  if (pokemonList.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto max-w-md rounded-[1.5rem] border border-zinc-800 bg-zinc-950/60 p-8">
          <p className="text-lg font-bold text-zinc-300">
            Nenhum Pokémon encontrado
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Tente limpar os filtros ou buscar por outro nome.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="block p-4 md:hidden">
        <div className="flex flex-col gap-4">
          {pokemonList.map((pokemon) => {
            const currentMarketPrice = getCurrentMarketPrice(pokemon);
            const difference = getDifference(pokemon);

            const hasDifference =
              Number(pokemon.purchasePrice || 0) > 0 &&
              currentMarketPrice > 0;

            return (
              <article
                key={pokemon.id}
                className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/70 p-4"
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => onEdit(pokemon)}
                    className="h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950"
                  >
                    {pokemon.cardImageUrl ? (
                      <img
                        src={pokemon.cardImageUrl}
                        alt={pokemon.selectedCard || pokemon.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                        Sem
                      </span>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-500">
                          #{String(pokemon.id).padStart(4, "0")}
                        </p>

                        <button
                          type="button"
                          onClick={() => onEdit(pokemon)}
                          className="mt-1 line-clamp-1 text-left text-lg font-black text-white"
                        >
                          {pokemon.name}
                        </button>
                      </div>

                      {pokemon.owned ? (
                        <StatusBadge status="Adquirido" variant="owned" />
                      ) : pokemon.selectedCard ? (
                        <StatusBadge status="Selecionado" variant="selected" />
                      ) : (
                        <StatusBadge status="Pendente" variant="pending" />
                      )}
                    </div>

                    <p className="mt-2 line-clamp-1 text-xs text-zinc-500">
                      {pokemon.selectedCard || "Ainda não selecionado"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-300">
                        {pokemon.formType}
                      </span>

                      {pokemon.averageMarketPrice > 0 && (
                        <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2 py-1 text-[10px] text-yellow-300">
                          Média calculada
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <MiniValue
                    label="Pago"
                    value={
                      pokemon.purchasePrice > 0
                        ? formatCurrency(pokemon.purchasePrice)
                        : "-"
                    }
                  />

                  <MiniValue
                    label="Média"
                    value={
                      currentMarketPrice > 0
                        ? formatCurrency(currentMarketPrice)
                        : "-"
                    }
                    highlight
                  />

                  <MiniValue
                    label="Dif."
                    value={
                      hasDifference
                        ? `${difference >= 0 ? "+" : "-"}${formatCurrency(
                            Math.abs(difference)
                          )}`
                        : "-"
                    }
                    positive={hasDifference && difference >= 0}
                    negative={hasDifference && difference < 0}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(pokemon)}
                    className="premium-button flex-1 rounded-2xl px-4 py-3 text-sm"
                  >
                    Editar
                  </button>

                  {pokemon.ligaPokemonUrl && (
                    <a
                      href={pokemon.ligaPokemonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-bold text-zinc-300"
                    >
                      Fonte
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1280px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/60 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <th className="px-6 py-5">ID</th>
              <th className="px-6 py-5">Pokémon/Forma</th>
              <th className="px-6 py-5">Tipo</th>
              <th className="px-6 py-5">Carta</th>
              <th className="px-6 py-5">Pago</th>
              <th className="px-6 py-5">Média NM</th>
              <th className="px-6 py-5">Diferença</th>
              <th className="px-6 py-5">Status</th>
              <th className="sticky right-0 z-20 bg-zinc-950/95 px-6 py-5 text-right">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {pokemonList.map((pokemon) => {
              const currentMarketPrice = getCurrentMarketPrice(pokemon);
              const difference = getDifference(pokemon);

              const hasDifference =
                Number(pokemon.purchasePrice || 0) > 0 &&
                currentMarketPrice > 0;

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
                        className={`truncate text-sm ${
                          pokemon.selectedCard
                            ? "text-zinc-200"
                            : "text-zinc-500"
                        }`}
                      >
                        {pokemon.selectedCard || "Ainda não selecionado"}
                      </p>

                      {pokemon.averageMarketPrice > 0 && (
                        <p className="mt-1 text-[10px] text-zinc-500">
                          Média entre Liga, MyPcards e TCGPlayer
                        </p>
                      )}
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
                      {currentMarketPrice > 0
                        ? formatCurrency(currentMarketPrice)
                        : "-"}
                    </p>

                    {pokemon.pricesUpdatedAt && (
                      <p className="mt-1 text-[10px] text-zinc-500">
                        Preços atualizados
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <p
                      className={`text-sm font-black ${
                        !hasDifference
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
      </div>
    </>
  );
}

type MiniValueProps = {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
};

function MiniValue({
  label,
  value,
  highlight = false,
  positive = false,
  negative = false,
}: MiniValueProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-[10px] text-zinc-500">{label}</p>
      <p
        className={`mt-1 text-xs font-black ${
          highlight
            ? "text-yellow-300"
            : positive
              ? "text-emerald-300"
              : negative
                ? "text-red-300"
                : "text-zinc-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}