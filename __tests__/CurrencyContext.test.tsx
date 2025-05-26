import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { CurrencyProvider, useCurrencyContext } from '../src/context/CurrencyContext';

const TestComponent = () => {
  const { fromCurrency, setFromCurrency } = useCurrencyContext();

  return (
    <>
      <Text testID="currency">{fromCurrency?.code || 'none'}</Text>
      <Text
        testID="button"
        onPress={() => setFromCurrency({ code: 'USD', symbol: '$', name: 'US Dollar' })}
      >
        Set Currency
      </Text>
    </>
  );
};

describe('CurrencyContext', () => {
  it('provides default values and updates state', () => {
    const { getByTestId } = render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>
    );

    expect(getByTestId('currency').props.children).toBe('none');

    act(() => {
      getByTestId('button').props.onPress();
    });

    expect(getByTestId('currency').props.children).toBe('USD');
  });

  it('throws error if used outside provider', () => {
    const BrokenComponent = () => {
      useCurrencyContext();
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrowError(
      'CurrencyContext must be used within CurrencyProvider'
    );
  });
});
