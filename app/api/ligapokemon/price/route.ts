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
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.ligapokemon.com.br/",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Não consegui acessar a página da Liga Pokémon. Status: ${response.status}`,
        },
        { status: 502 }
      );
    }

    const html = await response.text();

    const marketPrice = extractLowestNmPrice(html);

    if (marketPrice <= 0) {
      return NextResponse.json(
        {
          error:
            "Acessei a página, mas não encontrei preço no HTML. A Liga pode estar carregando os valores via JavaScript.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      marketPrice,
      condition: "NM",
      updatedAt: new Date().toISOString(),
      sourceUrl: url,
    });
  } catch (error) {
    console.error("Erro ao buscar preço na Liga Pokémon:", error);

    return NextResponse.json(
      { error: "Erro interno ao buscar preço da Liga Pokémon." },
      { status: 500 }
    );
  }
}