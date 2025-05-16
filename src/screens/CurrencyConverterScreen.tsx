import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { CurrencyItem } from '../types/currency';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Converter'>;
type RouteType = RouteProp<RootStackParamList, 'Converter'>;

export default function CurrencyConverterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();

  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<CurrencyItem | null>(null);
  const [toCurrency, setToCurrency] = useState<CurrencyItem | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const openCurrencySelection = (type: 'from' | 'to') => {
    navigation.navigate('SelectCurrency', {
      type,
      onSelect: (currency: CurrencyItem) => {
        if (type === 'from') setFromCurrency(currency);
        else setToCurrency(currency);
      },
    });
  };

  const convert = () => {
    const rate = 1.08;
    const amountNum = parseFloat(amount);
    if (!isNaN(amountNum)) {
      setResult(amountNum * rate);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
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
          title={fromCurrency ? `From: ${fromCurrency.code}` : 'Select currency "From"'}
          onPress={() => openCurrencySelection('from')}
        />
        <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
          <Text style={styles.swapText}>⇄</Text>
        </TouchableOpacity>
        <Button
          title={toCurrency ? `To: ${toCurrency.code}` : 'Select currency "To"'}
          onPress={() => openCurrencySelection('to')}
        />
      </View>

      <Button title="Convert" onPress={convert} disabled={!fromCurrency || !toCurrency} />

      {result !== null && (
        <Text style={styles.result}>
          {amount} {fromCurrency?.code} = {result.toFixed(2)} {toCurrency?.code}
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
