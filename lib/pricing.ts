export type CardPriceInputs = {
  ligaPrice: number;
  mypcardsPrice: number;
  tcgplayerPriceUsd: number;
  dollarRate: number;
};

export function calculateTcgPlayerPriceBrl(
  tcgplayerPriceUsd: number,
  dollarRate: number
) {
  return Number((tcgplayerPriceUsd * dollarRate).toFixed(2));
}

export function calculateAverageMarketPrice({
  ligaPrice,
  mypcardsPrice,
  tcgplayerPriceUsd,
  dollarRate,
}: CardPriceInputs) {
  const tcgplayerPriceBrl = calculateTcgPlayerPriceBrl(
    tcgplayerPriceUsd,
    dollarRate
  );

  const validPrices = [ligaPrice, mypcardsPrice, tcgplayerPriceBrl].filter(
    (price) => Number(price) > 0
  );

  if (validPrices.length === 0) {
    return {
      tcgplayerPriceBrl,
      averageMarketPrice: 0,
    };
  }

  const averageMarketPrice = Number(
    (
      validPrices.reduce((total, price) => total + price, 0) /
      validPrices.length
    ).toFixed(2)
  );

  return {
    tcgplayerPriceBrl,
    averageMarketPrice,
  };
}