import { CurrencyItem } from './currency';

export type RootStackParamList = {
  Converter: { selectedCurrency?: CurrencyItem };
  SelectCurrency: undefined;
};