export type CollectionData = {
  selectedCard: string;
  cardImageUrl: string;
  ligaPokemonUrl: string;
  lowestPrice: number;
  owned: boolean;
  notes: string;
};

export type CollectionState = Record<number, CollectionData>;

export type SelectedPokemon = {
  id: number;
  name: string;
  formType: string;
  searchName: string;
  selectedCard: string;
  cardImageUrl: string;
  ligaPokemonUrl: string;
  lowestPrice: number;
  owned: boolean;
  notes: string;
};