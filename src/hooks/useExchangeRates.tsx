import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.vatcomply.com';
const STORAGE_KEY_RATES = 'exchange_rates';
const STORAGE_KEY_CURRENCIES = 'currencies_list';

export interface CurrenciesResponse {
  [code: string]: string;
}

export interface RatesResponse {
  rates: Record<string, number>;
  base: string;
  date: string;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [currencies, setCurrencies] = useState<CurrenciesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const cachedRates = await AsyncStorage.getItem(STORAGE_KEY_RATES);
        const cachedCurrencies = await AsyncStorage.getItem(STORAGE_KEY_CURRENCIES);

        if (cachedRates) setRates(JSON.parse(cachedRates));
        if (cachedCurrencies) setCurrencies(JSON.parse(cachedCurrencies));

        const [ratesRes, currenciesRes] = await Promise.all([
          axios.get<RatesResponse>(`${BASE_URL}/rates`),
          axios.get<CurrenciesResponse>(`${BASE_URL}/currencies`),
        ]);

        setRates(ratesRes.data.rates);
        setCurrencies(currenciesRes.data);

        await AsyncStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(ratesRes.data.rates));
        await AsyncStorage.setItem(STORAGE_KEY_CURRENCIES, JSON.stringify(currenciesRes.data));
      } catch (e: any) {
        setError(e.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { rates, currencies, loading, error };
}
