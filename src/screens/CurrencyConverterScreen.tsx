import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { useExchangeRates }   from '../hooks/useExchangeRates';
import { useCurrencyContext } from '../context/CurrencyContext';

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
        <Button
          title={fromCurrency ? `From: ${fromCurrency.symbol}` : 'Select currency "From"'}
          onPress={() => openCurrencySelection('from')}
        />
        <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
          <Text style={styles.swapText}>⇄</Text>
        </TouchableOpacity>
        <Button
          title={toCurrency ? `To: ${toCurrency.symbol}` : 'Select currency "To"'}
          onPress={() => openCurrencySelection('to')}
        />
      </View>

      <Button title="Convert" onPress={convert} disabled={!fromCurrency || !toCurrency} />

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
  swapButton: {
    paddingHorizontal: 12,
  },
  swapText: {
    fontSize: 24,
  },
  result: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
