export async function fetchUsdBrlRate() {
  const response = await fetch("/api/exchange/usd-brl", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar cotação do dólar.");
  }

  return {
    dollarRate: Number(data.dollarRate || 0),
    updatedAt: data.updatedAt || "",
    source: data.source || "USD-BRL",
  };
}