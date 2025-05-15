import axios from 'axios';

const BASE_URL = 'https://api.vatcomply.com';

export const fetchCurrencies = async (): Promise<Record<string, string>> => {
  const res = await axios.get(`${BASE_URL}/currencies`);
  return res.data;
};