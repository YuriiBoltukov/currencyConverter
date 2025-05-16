import { CurrencyItem } from './currency';

export type RootStackParamList = {
  Converter: undefined;
  SelectCurrency: {
    type: 'from' | 'to';
    onSelect: (currency: CurrencyItem) => void;
  };
};