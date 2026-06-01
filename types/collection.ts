export type CollectionData = {
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
  purchasePrice: number;
  marketPrice: number;
  marketCondition: string;
  marketUpdatedAt: string;
  owned: boolean;
  notes: string;
};

export type PokemonCollectionItem = SelectedPokemon;

export type PokemonFormFromDatabase = {
  id: number;
  name: string;
  form_type: string;
  search_name: string;
};