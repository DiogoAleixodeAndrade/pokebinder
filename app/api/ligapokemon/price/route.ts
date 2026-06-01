import { NextResponse } from "next/server";

type LigaPriceResponse = {
  marketPrice: number;
  condition: string;
  updatedAt: string;
  sourceUrl: string;
};

function parseBrazilianCurrency(value: string) {
  const normalized = value
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function extractLowestNmPrice(html: string) {
  const priceRegex = /R\$\s?\d{1,3}(?:\.\d{3})*,\d{2}/g;
  const prices = html.match(priceRegex) || [];

  const normalizedPrices = prices
    .map(parseBrazilianCurrency)
    .filter((price) => price > 0);

  if (normalizedPrices.length === 0) {
    return 0;
  }

  return Math.min(...normalizedPrices);
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL da Liga Pokémon não informada." },
        { status: 400 }
      );
    }

    if (!url.includes("ligapokemon.com.br")) {
      return NextResponse.json(
        { error: "Informe uma URL válida da Liga Pokémon." },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Não consegui acessar a página da Liga Pokémon." },
        { status: 502 }
      );
    }

    const html = await response.text();

    /**
     * Primeira versão:
     * pega o menor preço encontrado na página.
     *
     * Depois a gente pode refinar para filtrar exatamente anúncios NM
     * quando confirmarmos como a Liga renderiza a condição no HTML.
     */
    const marketPrice = extractLowestNmPrice(html);

    if (marketPrice <= 0) {
      return NextResponse.json(
        {
          error:
            "Não encontrei preço na página. A Liga pode estar carregando os valores via JavaScript.",
        },
        { status: 404 }
      );
    }

    const result: LigaPriceResponse = {
      marketPrice,
      condition: "NM",
      updatedAt: new Date().toISOString(),
      sourceUrl: url,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar preço na Liga Pokémon:", error);

    return NextResponse.json(
      { error: "Erro interno ao buscar preço da Liga Pokémon." },
      { status: 500 }
    );
  }
}