import React, { useState }                                                                  from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute }                                               from '@react-navigation/native';
import { NativeStackNavigationProp }                          from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCurrencyContext } from '../context/CurrencyContext';
import { currencyToCountryMap } from '../utils/currencyCountryMap';
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

  const [searchQuery, setSearchQuery] = useState('');

  const { type } = route.params;
  const { fromCurrency, toCurrency, setFromCurrency, setToCurrency } = useCurrencyContext();

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
  }));

  const filteredCurrency = formattedCurrency.filter((item) =>
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFlagUrl = (currencyCode: string): string => {
    const countryCode = currencyToCountryMap[currencyCode];
    return countryCode
      ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
      : '';
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск валюты"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCurrency}
        renderItem={(item) => (
          <TouchableOpacity onPress={() => handleSelect(item.item.symbol, item.item.name)} style={[
            styles.item,
            (type === 'from' ? fromCurrency?.code : toCurrency?.code) === item.item.symbol && styles.selectedItem,
          ]}>
            <Image
              source={{ uri: getFlagUrl(item.item.symbol) }}
              style={{ width: 30, height: 20, marginRight: 10 }}
            />
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    margin: 12,
  },

  selectedItem: {
    backgroundColor: '#d0e8ff',
  },
});
