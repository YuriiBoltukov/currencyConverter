import { getFlagUrl } from '../src/utils/getFlagUrl';

jest.mock('../src/utils/currencyCountryMap', () => ({
  currencyToCountryMap: {
    USD: 'US',
    EUR: 'EU',
    GBP: 'GB',
  },
}));

describe('getFlagUrl', () => {
  it('возвращает корректный URL для известных валют', () => {
    expect(getFlagUrl('USD')).toBe('https://flagcdn.com/w40/us.png');
    expect(getFlagUrl('EUR')).toBe('https://flagcdn.com/w40/eu.png');
    expect(getFlagUrl('GBP')).toBe('https://flagcdn.com/w40/gb.png');
  });

  it('возвращает пустую строку для неизвестной валюты', () => {
    expect(getFlagUrl('ABC')).toBe('');
    expect(getFlagUrl('')).toBe('');
  });
});
