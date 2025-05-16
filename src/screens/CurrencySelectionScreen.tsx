import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute }                 from '@react-navigation/native';
import { NativeStackNavigationProp }                          from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { CurrencyItem } from '../types/currency';

const currencies: CurrencyItem[] = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectCurrency'>;
type RouteType = RouteProp<RootStackParamList, 'SelectCurrency'>;

export default function CurrencySelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { type, onSelect } = route.params;

  const handleSelect = (currency: CurrencyItem) => {
    onSelect(currency);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={currencies}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
            <Text style={styles.text}>{item.code} - {item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  text: { fontSize: 18 },
});
