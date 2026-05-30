import type { CollectionData, CollectionState, SelectedPokemon } from "@/types/collection";

type EditCardModalProps = {
  selectedPokemon: SelectedPokemon;
  collection: CollectionState;
  onClose: () => void;
  onClear: (pokemonId: number) => void | Promise<void>;
  onUpdate: (
    pokemonId: number,
    field: keyof CollectionData,
    value: string | number | boolean
  ) => void;
};

export function EditCardModal({
  selectedPokemon,
  collection,
  onClose,
  onClear,
  onUpdate,
}: EditCardModalProps) {
  const currentPokemon = collection[selectedPokemon.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-sm text-zinc-500">
              Editando #{String(selectedPokemon.id).padStart(4, "0")}
            </p>
            <h3 className="text-2xl font-bold">{selectedPokemon.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">
              {selectedPokemon.formType}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-red-400 hover:text-red-300"
          >
            Fechar
          </button>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-[1fr_220px]">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">Nome da carta</span>
              <input
                type="text"
                value={currentPokemon?.selectedCard || ""}
                onChange={(event) =>
                  onUpdate(
                    selectedPokemon.id,
                    "selectedCard",
                    event.target.value
                  )
                }
                placeholder="Ex: Charizard 025/185"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">Link da Liga Pokémon</span>
              <input
                type="url"
                value={currentPokemon?.ligaPokemonUrl || ""}
                onChange={(event) =>
                  onUpdate(
                    selectedPokemon.id,
                    "ligaPokemonUrl",
                    event.target.value
                  )
                }
                placeholder="Cole o link da carta na Liga Pokémon"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">URL da imagem</span>
              <input
                type="url"
                value={currentPokemon?.cardImageUrl || ""}
                onChange={(event) =>
                  onUpdate(
                    selectedPokemon.id,
                    "cardImageUrl",
                    event.target.value
                  )
                }
                placeholder="Cole o endereço da imagem da carta"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">Menor preço</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={currentPokemon?.lowestPrice || ""}
                onChange={(event) =>
                  onUpdate(
                    selectedPokemon.id,
                    "lowestPrice",
                    Number(event.target.value)
                  )
                }
                placeholder="0.00"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">Observações</span>
              <textarea
                value={currentPokemon?.notes || ""}
                onChange={(event) =>
                  onUpdate(selectedPokemon.id, "notes", event.target.value)
                }
                placeholder="Ex: quero comprar essa versão em português, estado NM..."
                rows={4}
                className="resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <input
                type="checkbox"
                checked={currentPokemon?.owned || false}
                onChange={(event) =>
                  onUpdate(selectedPokemon.id, "owned", event.target.checked)
                }
                className="h-5 w-5 accent-yellow-400"
              />
              <span className="text-sm text-zinc-300">
                Já possuo essa carta na coleção
              </span>
            </label>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="mb-3 text-sm font-medium text-zinc-300">
              Prévia da carta
            </p>

            {currentPokemon?.cardImageUrl ? (
              <img
                src={currentPokemon.cardImageUrl}
                alt={currentPokemon.selectedCard || selectedPokemon.name}
                className="w-full rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-zinc-700 text-center text-sm text-zinc-500">
                Cole a URL da imagem para ver a prévia.
              </div>
            )}

            {currentPokemon?.ligaPokemonUrl && (
              <a
                href={currentPokemon.ligaPokemonUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-semibold text-zinc-950 hover:bg-yellow-300"
              >
                Abrir na Liga Pokémon
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-800 p-5 md:flex-row md:justify-between">
          <button
            type="button"
            onClick={() => onClear(selectedPokemon.id)}
            className="rounded-xl border border-red-400/40 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-400/10"
          >
            Limpar cadastro
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-yellow-300"
          >
            Salvar e fechar
          </button>
        </div>
      </div>
    </div>
  );
}