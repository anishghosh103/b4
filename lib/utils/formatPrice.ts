export const formatPrice = (amount: { value: number; currency: string }) => {
  if (amount.value === 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: amount.currency,
    minimumFractionDigits: 0,
  }).format(amount.value);
};
