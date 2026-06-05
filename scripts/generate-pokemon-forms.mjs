import fs from "node:fs";
import path from "node:path";

const rawPath = path.join(process.cwd(), "data", "rawPokemonForms.txt");
const outputPath = path.join(process.cwd(), "data", "pokemonForms.ts");

function getFormType(name) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("mega")) return "Mega Evolução";
  if (lowerName.includes("gigantamax")) return "Gigantamax";
  if (lowerName.includes("alolan")) return "Forma Regional";
  if (lowerName.includes("galarian")) return "Forma Regional";
  if (lowerName.includes("hisuian")) return "Forma Regional";
  if (lowerName.includes("paldean")) return "Forma Regional";
  if (lowerName.includes("origin")) return "Forma Especial";
  if (lowerName.includes("primal")) return "Forma Especial";
  if (lowerName.includes("terastal")) return "Forma Especial";
  if (lowerName.includes("stellar")) return "Forma Especial";
  if (lowerName.includes("eternamax")) return "Forma Especial";
  if (lowerName.includes("incarnate")) return "Forma Especial";
  if (lowerName.includes("complete")) return "Forma Especial";
  if (lowerName.includes("dawn")) return "Forma Especial";
  if (lowerName.includes("dusk")) return "Forma Especial";
  if (lowerName.includes("mask")) return "Forma Especial";
  if (lowerName.includes("form")) return "Forma Especial";
  if (lowerName.includes("forme")) return "Forma Especial";
  if (lowerName.includes("(")) return "Variação";

  return "Padrão";
}

function getSearchName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getBaseName(name) {
  return name
    .replace(/^Mega\s+/i, "")
    .replace(/^Alolan\s+/i, "")
    .replace(/^Galarian\s+/i, "")
    .replace(/^Hisuian\s+/i, "")
    .replace(/^Paldean\s+/i, "")
    .replace(/\s+Gigantamax$/i, "")
    .replace(/\s+X$/i, "")
    .replace(/\s+Y$/i, "")
    .replace(/\s+Z$/i, "")
    .trim();
}

function getFormPriority(name) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("gigantamax")) return 4;
  if (lowerName.includes("mega")) return 3;

  if (
    lowerName.includes("alolan") ||
    lowerName.includes("galarian") ||
    lowerName.includes("hisuian") ||
    lowerName.includes("paldean")
  ) {
    return 2;
  }

  const isSpecial =
    lowerName.includes("origin") ||
    lowerName.includes("primal") ||
    lowerName.includes("terastal") ||
    lowerName.includes("stellar") ||
    lowerName.includes("eternamax") ||
    lowerName.includes("incarnate") ||
    lowerName.includes("complete") ||
    lowerName.includes("dawn") ||
    lowerName.includes("dusk") ||
    lowerName.includes("mask") ||
    lowerName.includes("form") ||
    lowerName.includes("forme") ||
    lowerName.includes("(");

  if (isSpecial) return 5;

  return 1;
}

function getGeneration(dexNumber) {
  if (dexNumber <= 151) return 1;
  if (dexNumber <= 251) return 2;
  if (dexNumber <= 386) return 3;
  if (dexNumber <= 493) return 4;
  if (dexNumber <= 649) return 5;
  if (dexNumber <= 721) return 6;
  if (dexNumber <= 809) return 7;
  if (dexNumber <= 905) return 8;
  return 9;
}

const rawContent = fs.readFileSync(rawPath, "utf-8");

const names = rawContent
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const decoratedNames = names.map((name, originalIndex) => ({
  name,
  originalIndex,
  baseName: getBaseName(name),
  priority: getFormPriority(name),
}));

decoratedNames.sort((a, b) => {
  const firstBaseIndexA = decoratedNames.find(
    (item) => item.baseName === a.baseName
  )?.originalIndex;

  const firstBaseIndexB = decoratedNames.find(
    (item) => item.baseName === b.baseName
  )?.originalIndex;

  if (firstBaseIndexA !== firstBaseIndexB) {
    return Number(firstBaseIndexA) - Number(firstBaseIndexB);
  }

  if (a.priority !== b.priority) {
    return a.priority - b.priority;
  }

  return a.originalIndex - b.originalIndex;
});

const baseDexMap = new Map();
let currentDexNumber = 0;

const pokemonForms = decoratedNames.map((item, index) => {
  if (!baseDexMap.has(item.baseName)) {
    currentDexNumber += 1;
    baseDexMap.set(item.baseName, currentDexNumber);
  }

  const dexNumber = baseDexMap.get(item.baseName);
  const generation = getGeneration(dexNumber);

  return {
    id: index + 1,
    dexNumber,
    generation,
    name: item.name,
    formType: getFormType(item.name),
    searchName: getSearchName(item.name),
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
});

const fileContent = `export type PokemonForm = {
  id: number;
  dexNumber: number;
  generation: number;
  name: string;
  formType: string;
  searchName: string;
  selectedCard: string;
  cardImageUrl: string;
  ligaPokemonUrl: string;
  lowestPrice: number;
  purchasePrice: number;
  marketPrice: number;
  marketCondition: string;
  marketUpdatedAt: string;
  owned: boolean;
  notes: string;
};

export const pokemonForms: PokemonForm[] = ${JSON.stringify(
  pokemonForms,
  null,
  2
)};
`;

fs.writeFileSync(outputPath, fileContent);

console.log(`Arquivo gerado com sucesso: ${outputPath}`);
console.log(`Total de formas cadastradas: ${pokemonForms.length}`);