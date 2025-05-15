import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CurrencyConverterScreen from './src/screens/CurrencyConverterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Converter" component={CurrencyConverterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
