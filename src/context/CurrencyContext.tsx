import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormattedCurrency }                      from '../types/currency';

interface CurrencyContextType {
  fromCurrency: FormattedCurrency | null;
  toCurrency: FormattedCurrency | null;
  setFromCurrency: (currency: FormattedCurrency) => void;
  setToCurrency: (currency: FormattedCurrency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('CurrencyContext must be used within CurrencyProvider');
  return context;
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [fromCurrency, setFromCurrency] = useState<FormattedCurrency | null>(null);
  const [toCurrency, setToCurrency] = useState<FormattedCurrency | null>(null);

  return (
    <CurrencyContext.Provider
      value={{
        fromCurrency,
        toCurrency,
        setFromCurrency,
        setToCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
