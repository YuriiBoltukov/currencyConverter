import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCurrencyContext } from '../context/CurrencyContext';
import { currencyToCountryMap } from '../utils/currencyCountryMap';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Converter'>;

export default function CurrencyConverterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [amount, setAmount] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);
  const { rates } = useExchangeRates();
  const { fromCurrency, toCurrency, setFromCurrency, setToCurrency } = useCurrencyContext();

  const openCurrencySelection = (type: 'from' | 'to') => {
    navigation.navigate('SelectCurrency', { type });
  };

  const convert = () => {
    if (!rates || !fromCurrency || !toCurrency) return;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return;

    const fromRate = rates[fromCurrency.code];
    const toRate = rates[toCurrency.code];

    if (!fromRate || !toRate) {
      console.error('Одна из валют не найдена в курсах:', fromCurrency.code, toCurrency.code);
      return;
    }

    const resultValue = (toRate / fromRate) * numericAmount;
    setResult(resultValue);
  };

  const swapCurrencies = () => {
    if (fromCurrency && toCurrency) {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setResult(null);
    }
  };

  const getFlagUrl = (currencyCode: string): string => {
    const countryCode = currencyToCountryMap[currencyCode];
    return countryCode ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png` : '';
  };

  const renderCurrencyButton = (type: 'from' | 'to') => {
    const currency = type === 'from' ? fromCurrency : toCurrency;

    return (
      <TouchableOpacity
        style={styles.currencyButton}
        onPress={() => openCurrencySelection(type)}
      >
        {currency && (
          <Image
            source={{ uri: getFlagUrl(currency.code) }}
            style={styles.flag}
          />
        )}
        <Text style={styles.currencyText}>
          {currency ? `${currency.symbol}` : type === 'from' ? 'From' : 'To'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Сумма:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.row}>
        {renderCurrencyButton('from')}
        <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
          <Text style={styles.swapText}>⇄</Text>
        </TouchableOpacity>
        {renderCurrencyButton('to')}
      </View>

      <TouchableOpacity
        style={[
          styles.convertButton,
          (!fromCurrency || !toCurrency) && styles.disabledButton,
        ]}
        onPress={convert}
        disabled={!fromCurrency || !toCurrency}
      >
        <Text style={styles.convertText}>Convert</Text>
      </TouchableOpacity>

      {result !== null && (
        <Text style={styles.result}>
          {amount} {fromCurrency?.symbol} = {result.toFixed(2)} {toCurrency?.symbol}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 18, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f4f4f4',
    minWidth: 110,
  },
  currencyText: {
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
  swapButton: {
    paddingHorizontal: 12,
  },
  swapText: {
    fontSize: 24,
  },
  convertButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  convertText: {
    color: '#fff',
    fontSize: 18,
  },
  result: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
