/**
 * Removes all non-numeric characters from the amount string.
 */
export const sanitizeAmount = (text: string): string => {
  return text.replace(/[^0-9.]/g, '');
};
