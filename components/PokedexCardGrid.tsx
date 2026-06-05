import type { PokemonCollectionItem } from "@/types/collection";
import { StatusBadge } from "@/components/ui/StatusBadge";

type PokedexCardGridProps = {
  pokemonList: PokemonCollectionItem[];
  onEdit: (pokemon: PokemonCollectionItem) => void;
  formatCurrency: (value: number) => string;
};

export function PokedexCardGrid({
  pokemonList,
  onEdit,
  formatCurrency,
}: PokedexCardGridProps) {
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

  return (
    <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pokemonList.map((pokemon) => {
        const currentMarketPrice = getCurrentMarketPrice(pokemon);
        const difference = getDifference(pokemon);

        const hasDifference =
          Number(pokemon.purchasePrice || 0) > 0 &&
          currentMarketPrice > 0;

        return (
          <article
            key={pokemon.id}
            className="premium-card premium-card-hover group overflow-hidden rounded-[1.75rem]"
          >
            <div className="relative flex h-80 items-center justify-center border-b border-zinc-800/80 bg-zinc-950/50 p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.10),transparent_55%)] opacity-0 transition group-hover:opacity-100" />

              <div className="absolute left-4 top-4 z-10">
                <span className="rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-xs font-black text-zinc-400">
                  #{String(pokemon.id).padStart(4, "0")}
                </span>
              </div>

              <div className="absolute right-4 top-4 z-10">
                {pokemon.owned ? (
                  <StatusBadge status="Adquirido" variant="owned" />
                ) : pokemon.selectedCard ? (
                  <StatusBadge status="Selecionado" variant="selected" />
                ) : (
                  <StatusBadge status="Pendente" variant="pending" />
                )}
              </div>

              {pokemon.cardImageUrl ? (
                <button
                  type="button"
                  onClick={() => onEdit(pokemon)}
                  className="relative z-10 h-full w-full"
                >
                  <img
                    src={pokemon.cardImageUrl}
                    alt={pokemon.selectedCard || pokemon.name}
                    className="mx-auto max-h-full rounded-2xl object-contain drop-shadow-2xl transition duration-300 group-hover:scale-105"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onEdit(pokemon)}
                  className="relative z-10 flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 text-center transition hover:border-yellow-400/50"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-2xl">
                    🃏
                  </div>

                  <p className="text-lg font-black text-zinc-200">
                    {pokemon.name}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-zinc-500">
                    {pokemon.formType}
                  </p>

                  <p className="mt-4 text-xs text-zinc-600">
                    Sem imagem cadastrada
                  </p>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 p-5">
              <div>
                <h3 className="text-xl font-black tracking-tight text-white">
                  {pokemon.name}
                </h3>

                <span className="mt-3 inline-flex rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1 text-xs font-semibold text-zinc-300">
                  {pokemon.formType}
                </span>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Carta selecionada
                </p>

                <p
                  className={`mt-2 min-h-5 text-sm ${
                    pokemon.selectedCard ? "text-zinc-200" : "text-zinc-500"
                  }`}
                >
                  {pokemon.selectedCard || "Ainda não selecionado"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PriceMiniCard
                  label="Pago"
                  value={
                    pokemon.purchasePrice > 0
                      ? formatCurrency(pokemon.purchasePrice)
                      : "-"
                  }
                  tone="neutral"
                />

                <PriceMiniCard
                  label="Média NM"
                  value={
                    currentMarketPrice > 0
                      ? formatCurrency(currentMarketPrice)
                      : "-"
                  }
                  tone="market"
                />
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  !hasDifference
                    ? "border-zinc-800 bg-zinc-950/60"
                    : difference >= 0
                      ? "border-emerald-400/20 bg-emerald-400/10"
                      : "border-red-400/20 bg-red-400/10"
                }`}
              >
                <p
                  className={`text-xs ${
                    !hasDifference
                      ? "text-zinc-500"
                      : difference >= 0
                        ? "text-emerald-300"
                        : "text-red-300"
                  }`}
                >
                  Diferença
                </p>

                <p
                  className={`mt-1 text-lg font-black ${
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
              </div>

              {pokemon.averageMarketPrice > 0 && (
                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
                  <p className="text-xs font-bold text-yellow-300">
                    Média calculada
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    Liga + MyPcards + TCGPlayer convertido em real.
                  </p>
                </div>
              )}

              {pokemon.notes && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <p className="text-xs text-zinc-500">Observação</p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-300">
                    {pokemon.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onEdit(pokemon)}
                  className="premium-button flex-1 rounded-2xl px-4 py-3 text-sm"
                >
                  Editar carta
                </button>

                {pokemon.ligaPokemonUrl && (
                  <a
                    href={pokemon.ligaPokemonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-yellow-400/50 hover:text-yellow-300"
                  >
                    Fonte
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}

      {pokemonList.length === 0 && (
        <div className="col-span-full p-8 text-center">
          <div className="mx-auto max-w-md rounded-[1.5rem] border border-zinc-800 bg-zinc-950/60 p-8">
            <p className="text-lg font-bold text-zinc-300">
              Nenhum Pokémon encontrado
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Ajuste os filtros ou busque por outro nome.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type PriceMiniCardProps = {
  label: string;
  value: string;
  tone: "neutral" | "market";
};

function PriceMiniCard({ label, value, tone }: PriceMiniCardProps) {
  const tones = {
    neutral: "border-zinc-800 bg-zinc-950/60 text-zinc-300",
    market: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-xs opacity-75">{label}</p>
      <p className="mt-1 text-base font-black">{value}</p>
    </div>
  );
}