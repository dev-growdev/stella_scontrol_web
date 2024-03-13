import numeral from 'numeral';

numeral.register('locale', 'br', {
	delimiters: {
		thousands: '.',
		decimal: ','
	},
	abbreviations: {
		thousand: 'k',
		million: 'm',
		billion: 'b',
		trillion: 't'
	},
	ordinal(number) {
		return number === 1 ? 'um' : 'um';
	},
	currency: {
		symbol: 'R$'
	}
});

export default numeral;
