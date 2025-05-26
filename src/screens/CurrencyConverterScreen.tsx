import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCurrencyContext } from '../context/CurrencyContext';
import { useCurrencyConversion } from '../hooks/useCurrencyConversion';
import CurrencyButton from '../components/CurrencyButton';
import { sanitizeAmount } from '../utils/sanitizeAmount';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Converter'>;

export default function CurrencyConverterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [amount, setAmount] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);
  const {
    fromCurrency,
    toCurrency,
    setFromCurrency,
    setToCurrency,
  } = useCurrencyContext();
  const { rates, loading } = useExchangeRates(fromCurrency?.code || null);
  const { convertCurrency } = useCurrencyConversion(rates);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading exchange rates...</Text>
      </View>
    );
  }

  // Memoized function to handle currency swap
  const handleSwapCurrencies = useCallback(() => {
    if (fromCurrency && toCurrency) {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setResult(null);
    }
  }, [fromCurrency, toCurrency]);

  // Trigger conversion when any input or context value changes
  useEffect(() => {
    if (!rates || !fromCurrency || !toCurrency) return;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return;

    const resultValue = convertCurrency(fromCurrency.code, toCurrency.code, numericAmount);
    if (resultValue !== null) {
      setResult(resultValue);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  // Navigate to currency selector screen
  const openCurrencySelection = useCallback((type: 'from' | 'to') => {
    navigation.navigate('SelectCurrency', { type });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>From:</Text>
          <CurrencyButton type="from" currency={fromCurrency} onPress={openCurrencySelection} />
        </View>

        <TouchableOpacity onPress={handleSwapCurrencies} style={styles.swapButton}>
          <Text style={styles.swapText}>⇄</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.label}>To:</Text>
          <CurrencyButton type="to" currency={toCurrency} onPress={openCurrencySelection} />
        </View>
      </View>

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(sanitizeAmount(text))}
      />

      {result !== null && (
        <Text style={styles.result}>
          {amount} {fromCurrency?.symbol} = {result.toFixed(2)} {toCurrency?.symbol}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  label: { fontSize: 18, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  swapButton: {
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    marginBottom: 8,
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
