import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExchangeRates } from '../src/hooks/useExchangeRates';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockRates = {
  base: 'EUR',
  date: '2023-01-01',
  rates: {
    USD: 1.1,
    GBP: 0.9,
  },
};

const mockCurrencies = {
  USD: { name: 'US Dollar', symbol: '$' },
  GBP: { name: 'British Pound', symbol: '£' },
};

const TestComponent = () => {
  const { rates, currencies, loading, error } = useExchangeRates();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <>
      <Text>USD rate: {rates?.USD}</Text>
      <Text>Currency name: {currencies?.USD.name}</Text>
    </>
  );
};

describe('useExchangeRates (via component)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders fetched data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/rates')) return Promise.resolve({ data: mockRates });
      if (url.includes('/currencies')) return Promise.resolve({ data: mockCurrencies });
    });

    const { getByText } = render(<TestComponent />);

    await waitFor(() => getByText(/USD rate: 1.1/));

    expect(getByText('USD rate: 1.1')).toBeTruthy();
    expect(getByText('Currency name: US Dollar')).toBeTruthy();
  });

  it('handles error', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { getByText } = render(<TestComponent />);

    await waitFor(() => getByText(/Error: Network error/));

    expect(getByText('Error: Network error')).toBeTruthy();
  });
});
