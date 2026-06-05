import { NextResponse } from "next/server";

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

function extractPrices(html: string) {
  const priceRegex = /R\$\s?\d{1,3}(?:\.\d{3})*,\d{2}/g;
  const prices = html.match(priceRegex) || [];

  return prices
    .map(parseBrazilianCurrency)
    .filter((price) => price > 0)
    .sort((a, b) => a - b);
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Informe o nome da carta para buscar." },
        { status: 400 }
      );
    }

    const searchUrl = `https://mypcards.com/pokemon/cards-avulsos?busca=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://mypcards.com/pokemon",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Não consegui acessar o MyPcards. Status: ${response.status}`,
          searchUrl,
        },
        { status: 502 }
      );
    }

    const html = await response.text();
    const prices = extractPrices(html);

    if (prices.length === 0) {
      return NextResponse.json(
        {
          error:
            "Acessei o MyPcards, mas não encontrei preços no HTML dessa busca.",
          searchUrl,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      query,
      source: "MyPcards",
      searchUrl,
      lowestPrice: prices[0],
      pricesFound: prices.slice(0, 10),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao buscar no MyPcards:", error);

    return NextResponse.json(
      { error: "Erro interno ao buscar no MyPcards." },
      { status: 500 }
    );
  }
}