// Formateador de valores a moneda

export function formatCurrency(amount: number) {
	return new Intl.NumberFormat('es-GT', {
		style: 'currency',
		currency: 'GTQ',
	}).format(amount);
}
