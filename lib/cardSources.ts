export function getCardSearchQuery(cardName: string, pokemonName: string) {
  return (cardName || pokemonName).trim();
}

export function getLigaPokemonSearchUrl(query: string) {
  return `https://www.ligapokemon.com.br/?view=cards%2Fsearch&card=${encodeURIComponent(
    query
  )}`;
}

export function getMyPcardsSearchUrl(query: string) {
  return `https://mypcards.com/pokemon?busca=${encodeURIComponent(query)}`;
}

export function getTcgPlayerSearchUrl(query: string) {
  return `https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=${encodeURIComponent(
    query
  )}`;
}