import { NextResponse } from "next/server";

type AwesomeApiResponse = {
  USDBRL?: {
    bid?: string;
    create_date?: string;
  };
};

type OpenExchangeResponse = {
  result?: string;
  rates?: {
    BRL?: number;
  };
  time_last_update_utc?: string;
};

async function fetchFromAwesomeApi() {
  const response = await fetch(
    "https://economia.awesomeapi.com.br/json/last/USD-BRL",
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`AwesomeAPI status ${response.status}`);
  }

  const data = (await response.json()) as AwesomeApiResponse;
  const dollarRate = Number(data.USDBRL?.bid || 0);

  if (!dollarRate || Number.isNaN(dollarRate)) {
    throw new Error("AwesomeAPI não retornou cotação válida.");
  }

  return {
    dollarRate,
    source: "AwesomeAPI USD-BRL",
    providerDate: data.USDBRL?.create_date || "",
  };
}

async function fetchFromOpenExchangeRate() {
  const response = await fetch("https://open.er-api.com/v6/latest/USD", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Open ER API status ${response.status}`);
  }

  const data = (await response.json()) as OpenExchangeResponse;
  const dollarRate = Number(data.rates?.BRL || 0);

  if (!dollarRate || Number.isNaN(dollarRate)) {
    throw new Error("Open ER API não retornou cotação válida.");
  }

  return {
    dollarRate,
    source: "Open ER API USD-BRL",
    providerDate: data.time_last_update_utc || "",
  };
}

export async function GET() {
  const errors: string[] = [];

  try {
    const result = await fetchFromAwesomeApi();

    return NextResponse.json({
      dollarRate: result.dollarRate,
      source: result.source,
      updatedAt: new Date().toISOString(),
      providerDate: result.providerDate,
    });
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Erro na AwesomeAPI");
  }

  try {
    const result = await fetchFromOpenExchangeRate();

    return NextResponse.json({
      dollarRate: result.dollarRate,
      source: result.source,
      updatedAt: new Date().toISOString(),
      providerDate: result.providerDate,
      fallbackUsed: true,
      previousErrors: errors,
    });
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Erro na API reserva");
  }

  return NextResponse.json(
    {
      error:
        "Não consegui buscar a cotação automática agora. Preencha a cotação manualmente.",
      errors,
    },
    { status: 502 }
  );
}