import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?.replace(/\/rest\/v1\/?$/, "")
  .replace(/\/$/, "");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL não foi configurada.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY não foi configurada.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const pokemonFormsPath = path.join(process.cwd(), "data", "pokemonForms.ts");

const fileContent = fs.readFileSync(pokemonFormsPath, "utf-8");

const match = fileContent.match(
  /export const pokemonForms: PokemonForm\[\] = ([\s\S]*);\s*$/
);

if (!match) {
  throw new Error("Não consegui ler o array pokemonForms do arquivo.");
}

const pokemonForms = JSON.parse(match[1]);

const rows = pokemonForms.map((pokemon) => ({
  id: pokemon.id,
  dex_number: pokemon.dexNumber,
  generation: pokemon.generation,
  name: pokemon.name,
  form_type: pokemon.formType,
  search_name: pokemon.searchName,
}));

console.log(`Enviando ${rows.length} Pokémon/Formas para o Supabase...`);

const { error } = await supabase.from("pokemon_forms").upsert(rows, {
  onConflict: "id",
});

if (error) {
  console.error("Erro ao enviar dados:", error);
  process.exit(1);
}

console.log("Seed concluído com sucesso!");