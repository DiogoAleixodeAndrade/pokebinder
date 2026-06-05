import { supabase } from "@/lib/supabase/client";
import type { PokemonFormFromDatabase } from "@/types/collection";

export async function getPokemonFormsFromSupabase() {
  const { data, error } = await supabase
    .from("pokemon_forms")
    .select("id, dex_number, generation, name, form_type, search_name")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as PokemonFormFromDatabase[];
}