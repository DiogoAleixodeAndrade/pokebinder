export type CollectionData = {
  selectedCard: string;
  cardImageUrl: string;
  ligaPokemonUrl: string;
  lowestPrice: number;
  purchasePrice: number;
  marketPrice: number;
  marketCondition: string;
  marketUpdatedAt: string;

  ligaPrice: number;
  mypcardsPrice: number;
  tcgplayerPriceUsd: number;
  tcgplayerPriceBrl: number;
  dollarRate: number;
  averageMarketPrice: number;
  pricesUpdatedAt: string;

  owned: boolean;
  notes: string;
};

export type CollectionState = Record<number, CollectionData>;

export type SelectedPokemon = {
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

  ligaPrice: number;
  mypcardsPrice: number;
  tcgplayerPriceUsd: number;
  tcgplayerPriceBrl: number;
  dollarRate: number;
  averageMarketPrice: number;
  pricesUpdatedAt: string;

  owned: boolean;
  notes: string;
};

export type PokemonCollectionItem = SelectedPokemon;

export type PokemonFormFromDatabase = {
  id: number;
  dex_number: number | null;
  generation: number | null;
  name: string;
  form_type: string;
  search_name: string;
};