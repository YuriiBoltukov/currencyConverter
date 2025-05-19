import { CurrencyItem } from './currency';

export type RootStackParamList = {
  Converter: undefined;
  SelectCurrency: { type: 'from' | 'to' };
};