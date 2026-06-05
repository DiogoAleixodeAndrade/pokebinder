export function getCardSearchQuery(cardName: string, pokemonName: string) {
  return (cardName || pokemonName).trim();
}

export function getMyPcardsSearchUrl(query: string) {
  return `https://mypcards.com/pokemon?busca=${encodeURIComponent(query)}`;
}

export function getTcgPlayerSearchUrl(query: string) {
  return `https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=${encodeURIComponent(
    query
  )}`;
}