import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import CurrencySelectionScreen from '../src/screens/CurrencySelectionScreen';
import { useCurrencyContext } from '../src/context/CurrencyContext';
import { useExchangeRates } from '../src/hooks/useExchangeRates';
import { useRoute } from '@react-navigation/native';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
  useRoute: jest.fn(),
}));

jest.mock('../src/context/CurrencyContext', () => ({
  useCurrencyContext: jest.fn(),
}));

jest.mock('../src/hooks/useExchangeRates', () => ({
  useExchangeRates: jest.fn(),
}));

jest.mock('../src/utils/getCurrencySymbol', () => ({
  getCurrencySymbol: (code: string) => code[0] || '$',
}));

jest.mock('../src/utils/getFlagUrl', () => ({
  getFlagUrl: (code: string) => `https://flags.example/${code}.png`,
}));

describe('CurrencySelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    (useExchangeRates as jest.Mock).mockReturnValue({
      loading: true,
      currencies: null,
      error: null,
    });

    (useCurrencyContext as jest.Mock).mockReturnValue({
      fromCurrency: null,
      toCurrency: null,
      setFromCurrency: jest.fn(),
      setToCurrency: jest.fn(),
    });

    (useRoute as jest.Mock).mockReturnValue({ params: { type: 'from' } });

    render(<CurrencySelectionScreen />);

    expect(screen.getByText('Loading currencies...')).toBeTruthy();
  });

  it('отображает ошибку при ошибке загрузки', () => {
    (useExchangeRates as jest.Mock).mockReturnValue({
      currencies: null,
      loading: false,
      error: 'Failed to load',
    });

    (useCurrencyContext as jest.Mock).mockReturnValue({
      fromCurrency: null,
      toCurrency: null,
      setFromCurrency: jest.fn(),
      setToCurrency: jest.fn(),
    });

    (useRoute as jest.Mock).mockReturnValue({ params: { type: 'from' } });

    const { getByText } = render(<CurrencySelectionScreen />);

    expect(getByText('Error loading currencies')).toBeTruthy();
    expect(getByText('Failed to load')).toBeTruthy();
  });

  it('фильтрует список по поисковому запросу и выбирает валюту', async () => {
    const mockSetFromCurrency = jest.fn();
    const currencies = {
      USD: { name: 'United States Dollar', symbol: '$' },
      EUR: { name: 'Euro', symbol: '€' },
      GBP: { name: 'British Pound', symbol: '£' },
    };

    (useExchangeRates as jest.Mock).mockReturnValue({
      currencies,
      loading: false,
      error: null,
    });

    (useCurrencyContext as jest.Mock).mockReturnValue({
      fromCurrency: null,
      toCurrency: null,
      setFromCurrency: mockSetFromCurrency,
      setToCurrency: jest.fn(),
    });

    (useRoute as jest.Mock).mockReturnValue({ params: { type: 'from' } });

    const { getByPlaceholderText, getByText, queryByText } = render(<CurrencySelectionScreen />);

    expect(getByText('$ - United States Dollar')).toBeTruthy();
    expect(getByText('€ - Euro')).toBeTruthy();
    expect(getByText('£ - British Pound')).toBeTruthy();

    const input = getByPlaceholderText?.('Search currency...') || getByText('');
    fireEvent.changeText(input, 'Euro');

    expect(getByText('€ - Euro')).toBeTruthy();
    expect(queryByText('$ - United States Dollar')).toBeNull();
    expect(queryByText('£ - British Pound')).toBeNull();

    fireEvent.press(getByText('€ - Euro'));
    await waitFor(() => {
      expect(mockSetFromCurrency).toHaveBeenCalledWith({
        code: '€',
        name: 'Euro',
        symbol: '€',
      });
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it('выбирает валюту и вызывает навигацию назад', () => {
    const mockSetToCurrency = jest.fn();

    (useExchangeRates as jest.Mock).mockReturnValue({
      currencies: {
        USD: { name: 'United States Dollar', symbol: '$' },
      },
      loading: false,
      error: null,
    });

    (useCurrencyContext as jest.Mock).mockReturnValue({
      fromCurrency: null,
      toCurrency: null,
      setFromCurrency: jest.fn(),
      setToCurrency: mockSetToCurrency,
    });

    (useRoute as jest.Mock).mockReturnValue({ params: { type: 'to' } });

    const { getByText } = render(<CurrencySelectionScreen />);

    fireEvent.press(getByText('$ - United States Dollar'));

    expect(mockSetToCurrency).toHaveBeenCalledWith({
      code: '$',
      name: 'United States Dollar',
      symbol: '$',
    });
    expect(mockGoBack).toHaveBeenCalled();
  });
});
