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
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse text-left">
        <thead className="bg-zinc-950 text-sm text-zinc-400">
          <tr>
            <th className="px-5 py-4">ID</th>
            <th className="px-5 py-4">Pokémon/Forma</th>
            <th className="px-5 py-4">Tipo</th>
            <th className="px-5 py-4">Carta selecionada</th>
            <th className="px-5 py-4">Preço</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Ações</th>
          </tr>
        </thead>

        <tbody>
          {pokemonList.map((pokemon) => (
            <tr
              key={pokemon.id}
              className="border-t border-zinc-800 hover:bg-zinc-800/40"
            >
              <td className="px-5 py-4 text-zinc-400">
                {String(pokemon.id).padStart(4, "0")}
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {pokemon.cardImageUrl ? (
                    <div className="group relative">
                      <img
                        src={pokemon.cardImageUrl}
                        alt={pokemon.selectedCard || pokemon.name}
                        className="h-12 w-9 rounded object-cover"
                      />

                      <div className="pointer-events-none fixed left-1/2 top-1/2 z-[9999] hidden w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-700 bg-zinc-950 p-3 shadow-2xl group-hover:block">
                        <img
                          src={pokemon.cardImageUrl}
                          alt={pokemon.selectedCard || pokemon.name}
                          className="h-auto max-h-[380px] w-full rounded-xl object-contain"
                        />

                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold text-white">
                            {pokemon.selectedCard || pokemon.name}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {pokemon.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-12 w-9 items-center justify-center rounded border border-zinc-700 bg-zinc-950 text-xs text-zinc-500">
                      ?
                    </div>
                  )}

                  <div>
                    <p className="font-medium">{pokemon.name}</p>
                    {pokemon.notes && (
                      <p className="mt-1 max-w-xs truncate text-xs text-zinc-500">
                        {pokemon.notes}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
                  {pokemon.formType}
                </span>
              </td>

              <td className="px-5 py-4 text-zinc-300">
                {pokemon.selectedCard || "Ainda não selecionado"}
              </td>

              <td className="px-5 py-4 text-zinc-300">
                {pokemon.lowestPrice > 0
                  ? formatCurrency(pokemon.lowestPrice)
                  : "-"}
              </td>

              <td className="px-5 py-4">
                {pokemon.owned ? (
                  <StatusBadge status="Adquirido" variant="owned" />
                ) : pokemon.selectedCard ? (
                  <StatusBadge status="Selecionado" variant="selected" />
                ) : (
                  <StatusBadge status="Pendente" variant="pending" />
                )}
              </td>

              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(pokemon)}
                    className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-yellow-300"
                  >
                    Editar
                  </button>

                  {pokemon.ligaPokemonUrl && (
                    <a
                      href={pokemon.ligaPokemonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-yellow-400 hover:text-yellow-300"
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
        <div className="p-8 text-center text-zinc-400">
          Nenhum Pokémon encontrado com os filtros atuais.
        </div>
      )}
    </div>
  );
}