import { sanitizeAmount } from '../src/utils/sanitizeAmount';

describe('sanitizeAmount', () => {
  it('удаляет все символы, кроме цифр и точки', () => {
    expect(sanitizeAmount('123.45')).toBe('123.45');
    expect(sanitizeAmount('$123.45')).toBe('123.45');
    expect(sanitizeAmount('1a2b3c.4d5e')).toBe('123.45');
    expect(sanitizeAmount('abc')).toBe('');
  });

  it('сохраняет только цифры, если точки нет', () => {
    expect(sanitizeAmount('abc123xyz')).toBe('123');
  });

  it('возвращает пустую строку, если входная строка пустая или без цифр/точек', () => {
    expect(sanitizeAmount('')).toBe('');
    expect(sanitizeAmount('!@#$%^&*')).toBe('');
  });

  it('обрабатывает строку с несколькими точками', () => {
    expect(sanitizeAmount('12.3.4.5')).toBe('12.3.4.5');
  });
});
