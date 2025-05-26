import { currencyToCountryMap } from './currencyCountryMap';

/**
 * Returns the URL of a country flag based on the currency code.
 */
export const getFlagUrl = (currencyCode: string): string => {
  const countryCode = currencyToCountryMap[currencyCode];
  return countryCode ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png` : '';
};
