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

const rawContent = fs.readFileSync(rawPath, "utf-8");

const names = rawContent
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const pokemonForms = names.map((name, index) => ({
  id: index + 1,
  name,
  formType: getFormType(name),
  searchName: getSearchName(name),
  selectedCard: "",
  cardImageUrl: "",
  ligaPokemonUrl: "",
  lowestPrice: 0,
  owned: false,
}));

const fileContent = `export type PokemonForm = {
  id: number;
  name: string;
  formType: string;
  searchName: string;
  selectedCard: string;
  cardImageUrl: string;
  ligaPokemonUrl: string;
  lowestPrice: number;
  owned: boolean;
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