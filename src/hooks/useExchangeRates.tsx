import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrenciesResponse } from '../types/currency';

const BASE_URL = 'https://api.vatcomply.com';
const STORAGE_KEY_CURRENCIES = 'currencies_list';

export interface RatesResponse {
  rates: Record<string, number>;
  base: string;
  date: string;
}

export function useExchangeRates(base: string | null) {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [currencies, setCurrencies] = useState<CurrenciesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!base) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        if (!currencies) {
          const cachedCurrencies = await AsyncStorage.getItem(STORAGE_KEY_CURRENCIES);
          if (cachedCurrencies) {
            setCurrencies(JSON.parse(cachedCurrencies));
          } else {
            const currenciesRes = await axios.get<CurrenciesResponse>(`${BASE_URL}/currencies`);
            setCurrencies(currenciesRes.data);
            await AsyncStorage.setItem(STORAGE_KEY_CURRENCIES, JSON.stringify(currenciesRes.data));
          }
        }

        const ratesRes = await axios.get<RatesResponse>(`${BASE_URL}/rates?base=${base}`);
        setRates(ratesRes.data.rates);
      } catch (e: any) {
        setError(e.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [base]);

  return { rates, currencies, loading, error };
}
