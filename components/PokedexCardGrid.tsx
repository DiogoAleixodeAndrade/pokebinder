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
  return (
    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pokemonList.map((pokemon) => (
        <article
          key={pokemon.id}
          className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-950/20"
        >
          <div className="flex h-72 items-center justify-center border-b border-zinc-800 bg-zinc-900 p-4">
            {pokemon.cardImageUrl ? (
              <img
                src={pokemon.cardImageUrl}
                alt={pokemon.selectedCard || pokemon.name}
                className="max-h-full rounded-xl object-contain transition group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-zinc-700 text-center text-sm text-zinc-500">
                Sem imagem
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-4">
            <div>
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-xs text-zinc-500">
                  #{String(pokemon.id).padStart(4, "0")}
                </p>

                {pokemon.owned ? (
                  <StatusBadge status="Adquirido" variant="owned" />
                ) : pokemon.selectedCard ? (
                  <StatusBadge status="Selecionado" variant="selected" />
                ) : (
                  <StatusBadge status="Pendente" variant="pending" />
                )}
              </div>

              <h3 className="text-lg font-bold">{pokemon.name}</h3>

              <span className="mt-2 inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                {pokemon.formType}
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <p className="text-xs text-zinc-500">Carta selecionada</p>
              <p className="mt-1 min-h-5 text-sm text-zinc-300">
                {pokemon.selectedCard || "Ainda não selecionado"}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-zinc-500">Menor preço</p>
                <p className="text-sm font-semibold text-yellow-300">
                  {pokemon.lowestPrice > 0
                    ? formatCurrency(pokemon.lowestPrice)
                    : "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onEdit(pokemon)}
                className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-yellow-300"
              >
                Editar
              </button>
            </div>

            {pokemon.ligaPokemonUrl && (
              <a
                href={pokemon.ligaPokemonUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-zinc-700 px-3 py-2 text-center text-sm text-zinc-300 hover:border-yellow-400 hover:text-yellow-300"
              >
                Abrir na Liga Pokémon
              </a>
            )}
          </div>
        </article>
      ))}

      {pokemonList.length === 0 && (
        <div className="col-span-full rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">
          Nenhum Pokémon encontrado com os filtros atuais.
        </div>
      )}
    </div>
  );
}