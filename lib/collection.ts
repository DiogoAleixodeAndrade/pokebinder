import type { ChangeEvent } from "react";
import { pokemonForms } from "@/data/pokemonForms";
import type { CollectionState } from "@/types/collection";

export const STORAGE_KEY = "pokebinder-collection";

export function getInitialCollectionState(): CollectionState {
  return pokemonForms.reduce<CollectionState>((acc, pokemon) => {
    acc[pokemon.id] = {
      selectedCard: pokemon.selectedCard,
      cardImageUrl: pokemon.cardImageUrl,
      ligaPokemonUrl: pokemon.ligaPokemonUrl,
      lowestPrice: pokemon.lowestPrice,
      purchasePrice: 0,
      marketPrice: 0,
      marketCondition: "NM",
      marketUpdatedAt: "",
      owned: pokemon.owned,
      notes: "",
    };

    return acc;
  }, {});
}

export function saveCollectionToStorage(collection: CollectionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

export function loadCollectionFromStorage() {
  const savedCollection = localStorage.getItem(STORAGE_KEY);

  if (!savedCollection) {
    return null;
  }

  return JSON.parse(savedCollection) as CollectionState;
}

export function createCollectionBackup(collection: CollectionState) {
  return {
    exportedAt: new Date().toISOString(),
    app: "PokéBinder",
    version: 1,
    collection,
  };
}

export function downloadCollectionBackup(collection: CollectionState) {
  const backup = createCollectionBackup(collection);

  const file = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = `pokebinder-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function importCollectionBackup(
  event: ChangeEvent<HTMLInputElement>,
  onSuccess: (collection: CollectionState) => void
) {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const result = reader.result;

      if (typeof result !== "string") {
        alert("Não consegui ler esse arquivo.");
        return;
      }

      const parsedBackup = JSON.parse(result);

      if (!parsedBackup.collection) {
        alert("Esse arquivo não parece ser um backup válido do PokéBinder.");
        return;
      }

      onSuccess(parsedBackup.collection);
      alert("Backup importado com sucesso!");
    } catch {
      alert("Erro ao importar backup. Verifique se o arquivo é um JSON válido.");
    }
  };

  reader.readAsText(file);
  event.target.value = "";
}