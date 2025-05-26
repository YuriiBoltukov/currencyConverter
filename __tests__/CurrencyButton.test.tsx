import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CurrencyButton from '../src/components/CurrencyButton';
import { FormattedCurrency } from '../src/types/currency';

const mockCurrency: FormattedCurrency = {
  code: 'USD',
  name: 'US Dollar',
  symbol: '$',
};

describe('CurrencyButton', () => {
  it('renders with currency and triggers onPress', () => {
    const mockPress = jest.fn();
    const { getByText, getByTestId } = render(
      <CurrencyButton type="from" currency={mockCurrency} onPress={mockPress} />
    );

    expect(getByText('$')).toBeTruthy();
    expect(getByTestId('currency-flag')).toBeTruthy();

    fireEvent.press(getByText('$'));
    expect(mockPress).toHaveBeenCalledWith('from');
  });

  it('renders fallback text when no currency', () => {
    const { getByText } = render(
      <CurrencyButton type="to" currency={null} onPress={() => {}} />
    );

    expect(getByText('To')).toBeTruthy();
  });
});
