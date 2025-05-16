import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { CurrencyItem } from '../types/currency';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Converter'>;
type RouteType = RouteProp<RootStackParamList, 'Converter'>;

export default function CurrencyConverterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem | null>(null);

  useEffect(() => {
    if (route.params?.selectedCurrency) {
      setSelectedCurrency(route.params.selectedCurrency);
    }
  }, [route.params?.selectedCurrency]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Выбранная валюта:</Text>
      <Text style={styles.currency}>
        {selectedCurrency ? `${selectedCurrency.code} - ${selectedCurrency.name}` : 'Ничего не выбрано'}
      </Text>
      <Button title="Выбрать валюту" onPress={() => navigation.navigate('SelectCurrency')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 18, marginBottom: 10 },
  currency: { fontSize: 20, marginBottom: 20 },
});
