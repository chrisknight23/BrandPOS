/**
 * Format a number as currency with dollar sign
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
}; 