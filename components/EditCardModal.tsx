"use client";

import type { ReactNode } from "react";
import type {
  CollectionData,
  CollectionState,
  SelectedPokemon,
} from "@/types/collection";
import { formatCurrency } from "@/lib/format";

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
  const savedPokemon = collection[selectedPokemon.id];

  const currentPokemon = {
    selectedCard: savedPokemon?.selectedCard || selectedPokemon.selectedCard || "",
    cardImageUrl: savedPokemon?.cardImageUrl || selectedPokemon.cardImageUrl || "",
    ligaPokemonUrl:
      savedPokemon?.ligaPokemonUrl || selectedPokemon.ligaPokemonUrl || "",
    lowestPrice: savedPokemon?.lowestPrice || selectedPokemon.lowestPrice || 0,
    purchasePrice:
      savedPokemon?.purchasePrice || selectedPokemon.purchasePrice || 0,
    marketPrice: savedPokemon?.marketPrice || selectedPokemon.marketPrice || 0,
    marketCondition:
      savedPokemon?.marketCondition || selectedPokemon.marketCondition || "NM",
    marketUpdatedAt:
      savedPokemon?.marketUpdatedAt || selectedPokemon.marketUpdatedAt || "",
    owned: savedPokemon?.owned || selectedPokemon.owned || false,
    notes: savedPokemon?.notes || selectedPokemon.notes || "",
  };

  const priceDifference =
    Number(currentPokemon.marketPrice || 0) -
    Number(currentPokemon.purchasePrice || 0);

  const hasPriceDifference =
    Number(currentPokemon.marketPrice || 0) > 0 &&
    Number(currentPokemon.purchasePrice || 0) > 0;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/80">
        <div className="sticky top-0 z-10 flex flex-col gap-4 border-b border-zinc-800 bg-zinc-950/95 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              Editando #{String(selectedPokemon.id).padStart(4, "0")}
            </p>

            <h2 className="mt-1 text-3xl font-black text-white">
              {selectedPokemon.name}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                {selectedPokemon.formType}
              </span>

              {currentPokemon.owned ? (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  Adquirido
                </span>
              ) : currentPokemon.selectedCard ? (
                <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs text-sky-300">
                  Selecionado
                </span>
              ) : (
                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                  Pendente
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-fit rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-400/50 hover:text-red-300"
          >
            Fechar
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome da carta">
                <input
                  type="text"
                  value={currentPokemon.selectedCard}
                  onChange={(event) =>
                    onUpdate(
                      selectedPokemon.id,
                      "selectedCard",
                      event.target.value
                    )
                  }
                  placeholder="Ex: Ivysaur 134/132"
                  className="premium-input w-full rounded-2xl px-4 py-3 text-sm"
                />
              </Field>

              <Field label="Preço que paguei">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentPokemon.purchasePrice || ""}
                  onChange={(event) =>
                    onUpdate(
                      selectedPokemon.id,
                      "purchasePrice",
                      Number(event.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="premium-input w-full rounded-2xl px-4 py-3 text-sm"
                />
              </Field>
            </div>

            <Field label="Link da fonte de preço">
              <input
                type="url"
                value={currentPokemon.ligaPokemonUrl}
                onChange={(event) =>
                  onUpdate(
                    selectedPokemon.id,
                    "ligaPokemonUrl",
                    event.target.value
                  )
                }
                placeholder="Cole o link da carta na Liga Pokémon, MyPcards ou outra fonte"
                className="premium-input w-full rounded-2xl px-4 py-3 text-sm"
              />
            </Field>

            <section className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-200">
                    Valor atual da carta
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Informe manualmente o menor valor NM encontrado na sua fonte de preço.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">
                  NM manual
                </span>
              </div>

              <div className="mt-4">
                <Field label="Valor atual NM">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentPokemon.marketPrice || ""}
                    onChange={(event) => {
                      onUpdate(
                        selectedPokemon.id,
                        "marketPrice",
                        Number(event.target.value)
                      );

                      onUpdate(selectedPokemon.id, "marketCondition", "NM");

                      onUpdate(
                        selectedPokemon.id,
                        "marketUpdatedAt",
                        new Date().toISOString()
                      );
                    }}
                    placeholder="0.00"
                    className="premium-input w-full rounded-2xl px-4 py-3 text-sm"
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <PriceBox
                  label="Você pagou"
                  value={
                    currentPokemon.purchasePrice > 0
                      ? formatCurrency(currentPokemon.purchasePrice)
                      : "-"
                  }
                  tone="neutral"
                />

                <PriceBox
                  label={`Atual ${currentPokemon.marketCondition || "NM"}`}
                  value={
                    currentPokemon.marketPrice > 0
                      ? formatCurrency(currentPokemon.marketPrice)
                      : "-"
                  }
                  tone="market"
                />

                <PriceBox
                  label="Diferença"
                  value={
                    hasPriceDifference
                      ? `${priceDifference >= 0 ? "+" : "-"}${formatCurrency(
                          Math.abs(priceDifference)
                        )}`
                      : "-"
                  }
                  tone={
                    !hasPriceDifference
                      ? "neutral"
                      : priceDifference >= 0
                        ? "profit"
                        : "loss"
                  }
                />
              </div>

              {currentPokemon.marketUpdatedAt && (
                <p className="mt-3 text-xs text-zinc-500">
                  Atualizado em:{" "}
                  {new Date(currentPokemon.marketUpdatedAt).toLocaleString(
                    "pt-BR"
                  )}
                </p>
              )}
            </section>

            <Field label="URL da imagem">
              <input
                type="url"
                value={currentPokemon.cardImageUrl}
                onChange={(event) =>
                  onUpdate(
                    selectedPokemon.id,
                    "cardImageUrl",
                    event.target.value
                  )
                }
                placeholder="Cole a URL da imagem da carta"
                className="premium-input w-full rounded-2xl px-4 py-3 text-sm"
              />
            </Field>

            <Field label="Observações">
              <textarea
                value={currentPokemon.notes}
                onChange={(event) =>
                  onUpdate(selectedPokemon.id, "notes", event.target.value)
                }
                placeholder="Ex: importado da planilha, carta desejada, estado NM..."
                rows={5}
                className="premium-input w-full resize-none rounded-2xl px-4 py-3 text-sm"
              />
            </Field>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <input
                type="checkbox"
                checked={currentPokemon.owned}
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
                  Marque quando ela já estiver na sua coleção.
                </p>
              </div>
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-4">
              <p className="text-sm font-bold text-zinc-200">
                Prévia da carta
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                A carta aparece grande aqui.
              </p>
            </div>

            {currentPokemon.cardImageUrl ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
                <img
                  src={currentPokemon.cardImageUrl}
                  alt={currentPokemon.selectedCard || selectedPokemon.name}
                  className="mx-auto max-h-[520px] w-full rounded-xl object-contain"
                />
              </div>
            ) : (
              <div className="flex h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-5 text-center">
                <div className="mb-4 text-4xl">🃏</div>
                <p className="text-sm font-bold text-zinc-300">
                  Sem imagem cadastrada
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Cole a URL da imagem para visualizar a carta.
                </p>
              </div>
            )}

            {currentPokemon.ligaPokemonUrl && (
              <a
                href={currentPokemon.ligaPokemonUrl}
                target="_blank"
                rel="noreferrer"
                className="premium-button mt-4 block rounded-2xl px-4 py-3 text-center text-sm"
              >
                Abrir fonte de preço
              </a>
            )}
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-800 bg-zinc-950 p-5 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={() => onClear(selectedPokemon.id)}
            className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/15"
          >
            Limpar cadastro
          </button>

          <button
            type="button"
            onClick={onClose}
            className="premium-button rounded-2xl px-6 py-3 text-sm"
          >
            Salvar e fechar
          </button>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

type PriceBoxProps = {
  label: string;
  value: string;
  tone: "neutral" | "market" | "profit" | "loss";
};

function PriceBox({ label, value, tone }: PriceBoxProps) {
  const tones = {
    neutral: "border-zinc-700 bg-zinc-950 text-zinc-300",
    market: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
    profit: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    loss: "border-red-400/30 bg-red-400/10 text-red-300",
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-xs opacity-80">{label}</p>
      <strong className="mt-1 block text-lg font-black">{value}</strong>
    </div>
  );
}