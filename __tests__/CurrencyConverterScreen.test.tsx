import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CurrencyConverterScreen from '../src/screens/CurrencyConverterScreen';

jest.mock('../src/hooks/useExchangeRates', () => ({
  useExchangeRates: () => ({ rates: { USD: 1, EUR: 0.9 } }),
}));

const mockSetFromCurrency = jest.fn();
const mockSetToCurrency = jest.fn();

jest.mock('../src/context/CurrencyContext', () => ({
  useCurrencyContext: () => ({
    fromCurrency: { code: 'USD', symbol: '$' },
    toCurrency: { code: 'EUR', symbol: '€' },
    setFromCurrency: mockSetFromCurrency,
    setToCurrency: mockSetToCurrency,
  }),
}));

const mockConvertCurrency = jest.fn((from, to, amount) => {
  if (from === 'USD' && to === 'EUR') return amount * 0.9;
  return null;
});

jest.mock('../src/hooks/useCurrencyConversion', () => ({
  useCurrencyConversion: () => ({
    convertCurrency: mockConvertCurrency,
  }),
}));

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('CurrencyConverterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial values', () => {
    const { getByText, getByDisplayValue } = render(<CurrencyConverterScreen />);

    expect(getByText('From:')).toBeTruthy();
    expect(getByText('To:')).toBeTruthy();
    expect(getByDisplayValue('1')).toBeTruthy();
    expect(getByText('⇄')).toBeTruthy();
  });

  it('shows conversion result after render', async () => {
    const { getByText } = render(<CurrencyConverterScreen />);

    await waitFor(() => {
      expect(mockConvertCurrency).toHaveBeenCalledWith('USD', 'EUR', 1);
    });

    expect(getByText('1 $ = 0.90 €')).toBeTruthy();
  });

  it('updates amount and recalculates conversion', async () => {
    const { getByDisplayValue, getByText } = render(<CurrencyConverterScreen />);

    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '10');

    await waitFor(() => {
      expect(mockConvertCurrency).toHaveBeenCalledWith('USD', 'EUR', 10);
    });

    expect(getByText('10 $ = 9.00 €')).toBeTruthy();
  });

  it('handles swap currencies button press', () => {
    const { getByText } = render(<CurrencyConverterScreen />);
    const swapButton = getByText('⇄');

    fireEvent.press(swapButton);

    expect(mockSetFromCurrency).toHaveBeenCalledWith({ code: 'EUR', symbol: '€' });
    expect(mockSetToCurrency).toHaveBeenCalledWith({ code: 'USD', symbol: '$' });
  });

  it('navigates to SelectCurrency screen on currency button press', () => {
    const { getAllByText } = render(<CurrencyConverterScreen />);

    const fromButton = getAllByText('$')[0];
    fireEvent.press(fromButton);

    expect(mockNavigate).toHaveBeenCalledWith('SelectCurrency', { type: 'from' });

    const toButton = getAllByText('€')[0];
    fireEvent.press(toButton);

    expect(mockNavigate).toHaveBeenCalledWith('SelectCurrency', { type: 'to' });
  });
});
