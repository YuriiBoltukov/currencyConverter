import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp }                          from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCurrencyContext } from '../context/CurrencyContext';

import { Feather } from '@expo/vector-icons';
import { getFlagUrl } from '../utils/getFlagUrl';
import { getCurrencySymbol }                from '../utils/getCurrencySymbol';
import { CurrencyValue, FormattedCurrency } from '../types/currency';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectCurrency'>;
type RouteType = RouteProp<RootStackParamList, 'SelectCurrency'>;

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
      symbol: getCurrencySymbol(code),
    };

    if (type === 'from') setFromCurrency(selected);
    else setToCurrency(selected);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading currencies...</Text>
      </View>
    );
  }

  if (error || !currencies) {
    return (
      <View style={styles.center}>
        <Text>Error loading currencies</Text>
        <Text>{error}</Text>
      </View>
    );
  }
  const currencyList= Object.entries(currencies) as unknown as [string, FormattedCurrency][];



  const formattedCurrency: FormattedCurrency[] = currencyList.map(([code, value]: [string, CurrencyValue]) => ({
    code,
    ...value,
  }));

  const filteredCurrency: FormattedCurrency[] = formattedCurrency.filter((item: FormattedCurrency) =>
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search currency..."
        />
      </View>
      <FlatList
        data={filteredCurrency}
        style={styles.listContainer}
        renderItem={({ item }) => {
          const isSelected = (type === 'from' ? fromCurrency?.code : toCurrency?.code) === item.symbol;

          return (
            <TouchableOpacity
              onPress={() => handleSelect(item.symbol, item.name)}
              style={[styles.item, isSelected && styles.selectedItem]}
            >
              <View style={styles.itemContent}>
                <Image
                  source={{ uri: getFlagUrl(item.symbol) }}
                  style={styles.flag}
                />
                <Text style={styles.text}>
                  {item.symbol} - {item.name}
                </Text>
              </View>

              <View style={styles.radioOuter}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  text: { fontSize: 16 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedItem: {
    backgroundColor: '#dedede',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    backgroundColor: '#e7e7e7',
    borderRadius: 8
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 2,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
    margin: 12,
  },

  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },

  searchInput: {
    paddingLeft: 36,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 16,
    color: '#000',
    backgroundColor: '#FFF',
  },
});
