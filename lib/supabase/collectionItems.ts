import { supabase } from "@/lib/supabase/client";
import type { CollectionState } from "@/types/collection";

type CollectionItemFromDatabase = {
  pokemon_form_id: number;
  selected_card: string | null;
  card_image_url: string | null;
  liga_pokemon_url: string | null;
  lowest_price: number | null;
  owned: boolean | null;
  notes: string | null;
};

export async function getCollectionItemsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from("collection_items")
    .select(
      "pokemon_form_id, selected_card, card_image_url, liga_pokemon_url, lowest_price, owned, notes"
    )
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const collectionState: CollectionState = {};

  data.forEach((item: CollectionItemFromDatabase) => {
    collectionState[item.pokemon_form_id] = {
      selectedCard: item.selected_card || "",
      cardImageUrl: item.card_image_url || "",
      ligaPokemonUrl: item.liga_pokemon_url || "",
      lowestPrice: Number(item.lowest_price || 0),
      owned: Boolean(item.owned),
      notes: item.notes || "",
    };
  });

  return collectionState;
}

export async function saveCollectionItemsToSupabase(
  userId: string,
  collection: CollectionState
) {
  const rows = Object.entries(collection)
    .filter(([, item]) => {
      return (
        item.selectedCard.trim() !== "" ||
        item.cardImageUrl.trim() !== "" ||
        item.ligaPokemonUrl.trim() !== "" ||
        item.lowestPrice > 0 ||
        item.owned ||
        item.notes.trim() !== ""
      );
    })
    .map(([pokemonFormId, item]) => ({
      user_id: userId,
      pokemon_form_id: Number(pokemonFormId),
      selected_card: item.selectedCard,
      card_image_url: item.cardImageUrl,
      liga_pokemon_url: item.ligaPokemonUrl,
      lowest_price: item.lowestPrice,
      owned: item.owned,
      notes: item.notes,
      updated_at: new Date().toISOString(),
    }));

  if (rows.length === 0) {
    return;
  }

  const { error } = await supabase.from("collection_items").upsert(rows, {
    onConflict: "user_id,pokemon_form_id",
  });

  if (error) {
    throw new Error(error.message);
  }
}