export function numToCurrency(value: number): string {
  const cvt = Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    unitDisplay: 'short',
    minimumFractionDigits: 2,
  })

  return cvt.format(value)
}
