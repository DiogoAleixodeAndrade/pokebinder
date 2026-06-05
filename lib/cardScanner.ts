import type { PokemonCollectionItem } from "@/types/collection";

export type ScannerMatchResult = {
  pokemon: PokemonCollectionItem | null;
  extractedText: string;
};

function normalizeScannerText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[:.]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findPokemonFromScannedText(
  extractedText: string,
  pokemonList: PokemonCollectionItem[]
): PokemonCollectionItem | null {
  const normalizedText = normalizeScannerText(extractedText);

  const candidates = pokemonList
    .map((pokemon) => ({
      pokemon,
      normalizedName: normalizeScannerText(pokemon.name),
    }))
    .filter(({ normalizedName }) => {
      return normalizedName.length >= 3 && normalizedText.includes(normalizedName);
    })
    .sort((a, b) => b.normalizedName.length - a.normalizedName.length);

  return candidates[0]?.pokemon ?? null;
}