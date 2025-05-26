import { useCallback } from 'react';
import { TRates }      from '../types/currency';

// Hook for currency conversion logic
export const useCurrencyConversion = (rates: TRates | null) => {
  console.log(rates);
  const convertCurrency = useCallback(
    (fromCode: string, toCode: string, amount: number): number | null => {
      if (!rates || !rates[fromCode] || !rates[toCode]) {
        console.error('Currency rate missing:', fromCode, toCode);
        return null;
      }

      return (rates[toCode] / rates[fromCode]) * amount;
    },
    [rates]
  );

  return { convertCurrency };
};
