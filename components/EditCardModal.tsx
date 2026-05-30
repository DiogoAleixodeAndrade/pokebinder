import type {
  CollectionData,
  CollectionState,
  SelectedPokemon,
} from "@/types/collection";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md">
      <div className="premium-card relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex max-h-[92vh] flex-col overflow-y-auto">
          <div className="flex flex-col gap-4 border-b border-zinc-800/80 p-5 md:flex-row md:items-start md:justify-between md:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 text-2xl shadow-2xl shadow-yellow-950/30">
                ✦
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  Editando #{String(selectedPokemon.id).padStart(4, "0")}
                </p>

                <h3 className="mt-1 text-3xl font-black tracking-tight text-white">
                  {selectedPokemon.name}
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1 text-xs text-zinc-300">
                    {selectedPokemon.formType}
                  </span>

                  {currentPokemon?.owned ? (
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                      Adquirido
                    </span>
                  ) : currentPokemon?.selectedCard ? (
                    <span className="rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-xs text-sky-300">
                      Selecionado
                    </span>
                  ) : (
                    <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1 text-xs text-zinc-400">
                      Pendente
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-fit rounded-2xl border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-400/50 hover:bg-red-400/10 hover:text-red-200"
            >
              Fechar
            </button>
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[1fr_300px] md:p-6">
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome da carta">
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
                    className="premium-input w-full rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-500"
                  />
                </Field>

                <Field label="Menor preço">
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
                    className="premium-input w-full rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-500"
                  />
                </Field>
              </div>

              <Field label="Link da Liga Pokémon">
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
                  className="premium-input w-full rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-500"
                />
              </Field>

              <Field label="URL da imagem">
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
                  className="premium-input w-full rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-500"
                />
              </Field>

              <Field label="Observações">
                <textarea
                  value={currentPokemon?.notes || ""}
                  onChange={(event) =>
                    onUpdate(selectedPokemon.id, "notes", event.target.value)
                  }
                  placeholder="Ex: quero comprar essa versão em português, estado NM..."
                  rows={5}
                  className="premium-input w-full resize-none rounded-2xl px-4 py-3 text-sm placeholder:text-zinc-500"
                />
              </Field>

              <label className="premium-card flex cursor-pointer items-center gap-4 rounded-2xl p-4 transition hover:border-yellow-400/40">
                <input
                  type="checkbox"
                  checked={currentPokemon?.owned || false}
                  onChange={(event) =>
                    onUpdate(selectedPokemon.id, "owned", event.target.checked)
                  }
                  className="h-6 w-6 accent-yellow-400"
                />

                <div>
                  <p className="text-sm font-bold text-zinc-200">
                    Já possuo essa carta
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Marque apenas quando a carta já estiver na sua coleção.
                  </p>
                </div>
              </label>
            </div>

            <aside className="premium-card rounded-[1.5rem] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-200">
                    Prévia da carta
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Visualização do card cadastrado
                  </p>
                </div>

                <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300">
                  Preview
                </span>
              </div>

              {currentPokemon?.cardImageUrl ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <img
                    src={currentPokemon.cardImageUrl}
                    alt={currentPokemon.selectedCard || selectedPokemon.name}
                    className="mx-auto max-h-[420px] w-full rounded-xl object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/70 p-5 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-2xl">
                    🃏
                  </div>

                  <p className="text-sm font-bold text-zinc-300">
                    {selectedPokemon.name}
                  </p>

                  <p className="mt-2 text-xs text-zinc-500">
                    Cole a URL da imagem para exibir a carta aqui.
                  </p>
                </div>
              )}

              {currentPokemon?.ligaPokemonUrl && (
                <a
                  href={currentPokemon.ligaPokemonUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="premium-button mt-4 block rounded-2xl px-4 py-3 text-center text-sm"
                >
                  Abrir na Liga Pokémon
                </a>
              )}
            </aside>
          </div>

          <div className="flex flex-col gap-3 border-t border-zinc-800/80 bg-zinc-950/35 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <button
              type="button"
              onClick={() => onClear(selectedPokemon.id)}
              className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/15"
            >
              Limpar cadastro
            </button>

            <div className="flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-zinc-700 bg-zinc-950/70 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={onClose}
                className="premium-button rounded-2xl px-5 py-3 text-sm"
              >
                Salvar e fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-zinc-300">{label}</span>
      {children}
    </label>
  );
}