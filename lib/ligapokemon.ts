export async function fetchLigaPokemonNmPrice(url: string) {
  const response = await fetch("/api/ligapokemon/price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar preço na Liga Pokémon.");
  }

  return {
    marketPrice: Number(data.marketPrice || 0),
    marketCondition: data.condition || "NM",
    marketUpdatedAt: data.updatedAt || "",
  };
}