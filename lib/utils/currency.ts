export function numToCurrency(value: number): string {
	return numToCurrencyString(value, 'BRL')
}

export function numToCurrencyString(value: number, currency: string): string {
	const cvt = Intl.NumberFormat('pt-BR', {
		currency,
		unitDisplay: 'short',
		minimumFractionDigits: 2,
	})

	return cvt.format(value)
}
