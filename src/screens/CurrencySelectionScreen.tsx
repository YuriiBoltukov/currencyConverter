import React                                                                     from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute }                                    from '@react-navigation/native';
import { NativeStackNavigationProp }                          from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCurrencyContext } from '../context/CurrencyContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectCurrency'>;
type RouteType = RouteProp<RootStackParamList, 'SelectCurrency'>;
type FormattedData = {
  key: string;
  name: string;
  symbol: string;
}
type CurrencyValue = {
  name: string;
  symbol: string;
};

export default function CurrencySelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { type } = route.params;
  const { setFromCurrency, setToCurrency } = useCurrencyContext();

  const { currencies, loading, error } = useExchangeRates();

  const handleSelect = (code: string, name: string) => {
    const selected = {
      code,
      name,
      symbol: getSymbolForCurrency(code),
    };

    if (type === 'from') setFromCurrency(selected);
    else setToCurrency(selected);

    navigation.goBack();
  };

  const getSymbolForCurrency = (symbol: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      RUB: '₽',
      JPY: '¥',
    };

    return symbols[symbol] || symbol;
  };

  if (error || !currencies) {
    return (
      <View style={styles.center}>
        <Text>Ошибка загрузки валют</Text>
        <Text>{error}</Text>
      </View>
    );
  }
  const currencyList= Object.entries(currencies) as unknown as [string, CurrencyValue][];
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Загрузка валют...</Text>
      </View>
    );
  }
  const formattedCurrency: FormattedData[] = currencyList.map(([key, value]: [string, CurrencyValue]) => ({
    key,
    ...value,
  }))
  return (
    <View style={styles.container}>
      <FlatList
        data={formattedCurrency}
        renderItem={(item) => (
          <TouchableOpacity onPress={() => handleSelect(item.item.symbol, item.item.name)} style={styles.item}>
            <Text style={styles.text}>{item.item.symbol} - {item.item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: { fontSize: 16 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
