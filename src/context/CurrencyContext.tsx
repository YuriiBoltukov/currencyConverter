import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CurrencyItem } from '../types/currency';

interface CurrencyContextType {
  fromCurrency: CurrencyItem | null;
  toCurrency: CurrencyItem | null;
  setFromCurrency: (currency: CurrencyItem) => void;
  setToCurrency: (currency: CurrencyItem) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('CurrencyContext must be used within CurrencyProvider');
  return context;
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [fromCurrency, setFromCurrency] = useState<CurrencyItem | null>(null);
  const [toCurrency, setToCurrency] = useState<CurrencyItem | null>(null);

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
