import { pokemonForms } from "@/data/pokemonForms";
import type { CollectionState } from "@/types/collection";

const STORAGE_KEY = "pokebinder-collection";

export function getInitialCollectionState(): CollectionState {
  return pokemonForms.reduce<CollectionState>((acc, pokemon) => {
    acc[pokemon.id] = {
      selectedCard: pokemon.selectedCard || "",
      cardImageUrl: pokemon.cardImageUrl || "",
      ligaPokemonUrl: pokemon.ligaPokemonUrl || "",
      lowestPrice: pokemon.lowestPrice || 0,
      purchasePrice: pokemon.purchasePrice || 0,
      marketPrice: pokemon.marketPrice || 0,
      marketCondition: pokemon.marketCondition || "NM",
      marketUpdatedAt: pokemon.marketUpdatedAt || "",

      ligaPrice: 0,
      mypcardsPrice: 0,
      tcgplayerPriceUsd: 0,
      tcgplayerPriceBrl: 0,
      dollarRate: 0,
      averageMarketPrice: 0,
      pricesUpdatedAt: "",

      owned: pokemon.owned || false,
      notes: pokemon.notes || "",
    };

    return acc;
  }, {});
}

export function loadCollectionFromStorage(): CollectionState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawCollection = window.localStorage.getItem(STORAGE_KEY);

  if (!rawCollection) {
    return null;
  }

  try {
    const parsedCollection = JSON.parse(rawCollection) as CollectionState;
    const initialCollection = getInitialCollectionState();

    return Object.entries(parsedCollection).reduce<CollectionState>(
      (acc, [pokemonId, item]) => {
        const id = Number(pokemonId);

        acc[id] = {
          ...initialCollection[id],
          ...item,

          ligaPrice: item.ligaPrice || 0,
          mypcardsPrice: item.mypcardsPrice || 0,
          tcgplayerPriceUsd: item.tcgplayerPriceUsd || 0,
          tcgplayerPriceBrl: item.tcgplayerPriceBrl || 0,
          dollarRate: item.dollarRate || 0,
          averageMarketPrice: item.averageMarketPrice || 0,
          pricesUpdatedAt: item.pricesUpdatedAt || "",
        };

        return acc;
      },
      initialCollection
    );
  } catch (error) {
    console.error("Erro ao carregar coleção do localStorage:", error);
    return null;
  }
}

export function saveCollectionToStorage(collection: CollectionState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

export function downloadCollectionBackup(collection: CollectionState) {
  const fileContent = JSON.stringify(collection, null, 2);

  const blob = new Blob([fileContent], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `pokebinder-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}