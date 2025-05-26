import { renderHook } from '@testing-library/react-native';
import { useCurrencyConversion } from '../src/hooks/useCurrencyConversion';

describe('useCurrencyConversion', () => {
  const rates = {
    USD: 1,
    EUR: 0.9,
    GBP: 0.8,
  };

  it('correctly converts currency when rates are valid', () => {
    const { result } = renderHook(() => useCurrencyConversion(rates));

    const converted = result.current.convertCurrency('USD', 'EUR', 100);
    expect(converted).toBeCloseTo(90);

    const converted2 = result.current.convertCurrency('GBP', 'USD', 80);
    expect(converted2).toBeCloseTo(100);
  });

  it('returns null if rates is null', () => {
    const { result } = renderHook(() => useCurrencyConversion(null));
    const converted = result.current.convertCurrency('USD', 'EUR', 100);
    expect(converted).toBeNull();
  });

  it('returns null if one of the currency rates is missing', () => {
    const partialRates = { USD: 1 };
    const { result } = renderHook(() => useCurrencyConversion(partialRates));
    const converted = result.current.convertCurrency('USD', 'EUR', 100);
    expect(converted).toBeNull();
  });

  it('convertCurrency function changes if rates change', () => {
    const { result, rerender } = renderHook(({ rates }) => useCurrencyConversion(rates), {
      initialProps: { rates: { USD: 1, EUR: 0.9 } },
    });

    const firstFn = result.current.convertCurrency;

    rerender({ rates: { USD: 1, EUR: 0.8 } });

    const secondFn = result.current.convertCurrency;
    expect(secondFn).not.toBe(firstFn);
  });
});
