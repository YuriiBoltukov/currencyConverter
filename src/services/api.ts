import axios from 'axios';

const BASE_URL = 'https://api.vatcomply.com';

export interface CurrenciesResponse {
  [code: string]: string;
}

export interface RatesResponse {
  rates: Record<string, number>;
  base: string;
  date: string;
}

export const fetchCurrencies = async (): Promise<CurrenciesResponse> => {
  try {
    const res = await axios.get<CurrenciesResponse>(`${BASE_URL}/currencies`);
    return res.data;
  } catch (error) {
    throw new Error('Ошибка при загрузке списка валют');
  }
};

export const fetchRates = async (): Promise<RatesResponse> => {
  try {
    const res = await axios.get<RatesResponse>(`${BASE_URL}/rates`);
    return res.data;
  } catch (error) {
    throw new Error('Ошибка при загрузке курсов валют');
  }
};
