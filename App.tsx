import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CurrencyConverterScreen from './src/screens/CurrencyConverterScreen';
import CurrencySelectionScreen from './src/screens/CurrencySelectionScreen';
import { RootStackParamList } from './src/types/navigation';
import { CurrencyProvider } from './src/context/CurrencyContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CurrencyProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Converter" component={CurrencyConverterScreen} />
          <Stack.Screen name="SelectCurrency" component={CurrencySelectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CurrencyProvider>
  );
}
