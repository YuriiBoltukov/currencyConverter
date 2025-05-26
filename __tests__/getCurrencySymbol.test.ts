import { getCurrencySymbol } from '../src/utils/getCurrencySymbol';

test('returns the correct currency symbol', () => {
  expect(getCurrencySymbol('USD')).toBe('$');
  expect(getCurrencySymbol('EUR')).toBe('€');
});