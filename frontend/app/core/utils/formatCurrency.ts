/**
 * Format number to Indonesian Rupiah currency string.
 * formatCurrency(150000) → "Rp 150.000"
 * formatCurrency(2500000) → "Rp 2.500.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
