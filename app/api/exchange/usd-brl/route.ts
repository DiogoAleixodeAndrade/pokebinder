import { NextResponse } from "next/server";

type AwesomeApiResponse = {
  USDBRL?: {
    bid?: string;
    create_date?: string;
  };
};

export async function GET() {
  try {
    const response = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao buscar cotação. Status: ${response.status}` },
        { status: 502 }
      );
    }

    const data = (await response.json()) as AwesomeApiResponse;

    const dollarRate = Number(data.USDBRL?.bid || 0);

    if (!dollarRate || Number.isNaN(dollarRate)) {
      return NextResponse.json(
        { error: "Não consegui interpretar a cotação do dólar." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      dollarRate,
      source: "AwesomeAPI USD-BRL",
      updatedAt: new Date().toISOString(),
      providerDate: data.USDBRL?.create_date || "",
    });
  } catch (error) {
    console.error("Erro ao buscar cotação USD-BRL:", error);

    return NextResponse.json(
      { error: "Erro interno ao buscar cotação USD-BRL." },
      { status: 500 }
    );
  }
}