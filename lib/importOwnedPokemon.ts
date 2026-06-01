import type {
  CollectionState,
  PokemonCollectionItem,
} from "@/types/collection";

type ImportOwnedPokemonResult = {
  updatedCollection: CollectionState;
  matchedCount: number;
  notFoundNames: string[];
  duplicatedNames: string[];
};

function normalizeImportedName(value: string) {
  return value
    .toString()
    .trim()
    .replace(/^#?\d+\s*[-–.]?\s*/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[♀]/g, " femea")
    .replace(/[♂]/g, " macho")
    .replace(/[’']/g, "")
    .replace(/[:.]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractNamesFromExcel(file: File) {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const names: string[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      blankrows: false,
    });

    rows.forEach((row) => {
      row.forEach((cell) => {
        if (cell === null || cell === undefined) return;

        const value = String(cell).trim();

        if (value.length > 1) {
          names.push(value);
        }
      });
    });
  });

  return names;
}

async function extractNamesFromText(file: File) {
  const text = await file.text();

  return text
    .split(/\r?\n|,|;/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function extractPokemonNames(file: File) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    return extractNamesFromExcel(file);
  }

  if (fileName.endsWith(".csv") || fileName.endsWith(".txt")) {
    return extractNamesFromText(file);
  }

  throw new Error("Formato inválido. Use .xlsx, .xls, .csv ou .txt.");
}

function addNameAlias(
  map: Map<string, PokemonCollectionItem>,
  alias: string,
  pokemon: PokemonCollectionItem
) {
  map.set(normalizeImportedName(alias), pokemon);
}

export async function importOwnedPokemonFile(
  file: File,
  pokemonList: PokemonCollectionItem[],
  currentCollection: CollectionState
): Promise<ImportOwnedPokemonResult> {
  const importedNames = await extractPokemonNames(file);

  const pokemonByName = new Map<string, PokemonCollectionItem>();

  pokemonList.forEach((pokemon) => {
    pokemonByName.set(normalizeImportedName(pokemon.name), pokemon);
    pokemonByName.set(normalizeImportedName(pokemon.searchName), pokemon);

    const normalizedPokemonName = normalizeImportedName(pokemon.name);

    if (normalizedPokemonName === "nidoran femea") {
      addNameAlias(pokemonByName, "Nidoran F", pokemon);
      addNameAlias(pokemonByName, "Nidoran Female", pokemon);
      addNameAlias(pokemonByName, "Nidoran Fêmea", pokemon);
      addNameAlias(pokemonByName, "Nidoran♀", pokemon);
    }

    if (normalizedPokemonName === "nidoran macho") {
      addNameAlias(pokemonByName, "Nidoran M", pokemon);
      addNameAlias(pokemonByName, "Nidoran Male", pokemon);
      addNameAlias(pokemonByName, "Nidoran Macho", pokemon);
      addNameAlias(pokemonByName, "Nidoran♂", pokemon);
    }

    if (normalizedPokemonName === "mr mime") {
      addNameAlias(pokemonByName, "Mr. Mime", pokemon);
      addNameAlias(pokemonByName, "Mr Mime", pokemon);
    }

    if (normalizedPokemonName === "mime jr") {
      addNameAlias(pokemonByName, "Mime Jr.", pokemon);
      addNameAlias(pokemonByName, "Mime Jr", pokemon);
    }

    if (normalizedPokemonName === "ho oh") {
      addNameAlias(pokemonByName, "Ho-Oh", pokemon);
      addNameAlias(pokemonByName, "Ho Oh", pokemon);
    }

    if (normalizedPokemonName === "porygon z") {
      addNameAlias(pokemonByName, "Porygon-Z", pokemon);
      addNameAlias(pokemonByName, "Porygon Z", pokemon);
    }

    if (normalizedPokemonName === "type null") {
      addNameAlias(pokemonByName, "Type: Null", pokemon);
      addNameAlias(pokemonByName, "Type Null", pokemon);
    }

    if (normalizedPokemonName === "farfetchd") {
      addNameAlias(pokemonByName, "Farfetch’d", pokemon);
      addNameAlias(pokemonByName, "Farfetchd", pokemon);
    }

    if (normalizedPokemonName === "sirfetchd") {
      addNameAlias(pokemonByName, "Sirfetch’d", pokemon);
      addNameAlias(pokemonByName, "Sirfetchd", pokemon);
    }
  });

  const updatedCollection: CollectionState = {
    ...currentCollection,
  };

  const foundIds = new Set<number>();
  const notFoundNames: string[] = [];
  const duplicatedNames: string[] = [];

  importedNames.forEach((rawName) => {
    const normalizedName = normalizeImportedName(rawName);

    if (!normalizedName) return;

    const pokemon = pokemonByName.get(normalizedName);

    if (!pokemon) {
      notFoundNames.push(rawName);
      return;
    }

    if (foundIds.has(pokemon.id)) {
      duplicatedNames.push(rawName);
      return;
    }

    foundIds.add(pokemon.id);

    const currentItem = updatedCollection[pokemon.id] ?? {
      selectedCard: "",
      cardImageUrl: "",
      ligaPokemonUrl: "",
      lowestPrice: 0,
      purchasePrice: 0,
      marketPrice: 0,
      marketCondition: "NM",
      marketUpdatedAt: "",
      owned: false,
      notes: "",
    };

    updatedCollection[pokemon.id] = {
      ...currentItem,
      selectedCard: currentItem.selectedCard || "Carta não especificada",
      owned: true,
      notes: currentItem.notes || "Importado da planilha",
    };
  });

  return {
    updatedCollection,
    matchedCount: foundIds.size,
    notFoundNames,
    duplicatedNames,
  };
}