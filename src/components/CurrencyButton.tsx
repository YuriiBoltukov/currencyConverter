import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { getFlagUrl } from '../utils/getFlagUrl';
import { FormattedCurrency } from '../types/currency';

interface Props {
  type: 'from' | 'to';
  currency?: FormattedCurrency | null;
  onPress: (type: 'from' | 'to') => void;
}

export default function CurrencyButton({ type, currency, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onPress(type)}
    >
      {currency && (
        <Image
          source={{ uri: getFlagUrl(currency.code) }}
          style={styles.flag}
          testID="currency-flag"
        />
      )}
      <Text style={styles.text}>
        {currency ? `${currency.symbol}` : type === 'from' ? 'From' : 'To'}
      </Text>
      <Text style={styles.arrow}>▼</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#dedede',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 110,
  },
  text: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  arrow: {
    fontSize: 16,
    color: '#888',
  },
  flag: {
    width: 26,
    height: 18,
    borderRadius: 2,
  },
});
