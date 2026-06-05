export async function searchMyPcardsPrice(query: string) {
  const response = await fetch("/api/mypcards/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar preço no MyPcards.");
  }

  return {
    source: data.source || "MyPcards",
    searchUrl: data.searchUrl || "",
    lowestPrice: Number(data.lowestPrice || 0),
    pricesFound: data.pricesFound || [],
    updatedAt: data.updatedAt || "",
  };
}