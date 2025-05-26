
export type TRates = Record<string, number>;

export type FormattedCurrency = {
  code: string;
  name: string;
  symbol: string;
};

export type CurrencyValue = {
  name: string;
  symbol: string;
};

export type CurrenciesResponse = Record<string, {
  name: string;
  symbol: string;
}>;