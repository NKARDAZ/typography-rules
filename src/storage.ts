import type { StringMap, CharacterData, CharacterSet, AnyCharacterSet, ProtoSet } from '@/types';

const proto = {
	join(this: StringMap, joiner = '|'): string {
		return Object.values(this).join(joiner);
	},
};

export function createCharacters<T extends CharacterData>(data: T): CharacterSet<T> {
	return Object.assign(Object.create(proto), data) as CharacterSet<T>;
}

export function createProtoSet<
	T extends { common?: Record<string, AnyCharacterSet> },
>(): ProtoSet<T> {
	return {
		get(dataSet, key) {
			const commonEntry = (this.common as Record<string, object>)?.[key as string] ?? {};
			const localeEntry = (this[dataSet] as Record<string, object>)?.[key as string] ?? {};

			return createCharacters({ ...commonEntry, ...localeEntry } as CharacterData);
		},
	};
}

export function createCharacterSet<
	T extends { common?: Record<string, AnyCharacterSet> } & Record<
		string,
		Record<string, AnyCharacterSet>
	>,
>(data: T) {
	return Object.assign(Object.create(createProtoSet<T>()), data) as T & ProtoSet<T>;
}

export const CHARACTERS = createCharacters({

});

export const DASHES = createCharacters({
	em: '\u2014', // —
	en: '\u2013', // –
});

export const SPACES = createCharacters({
	_: '\u0020', // Space
	nb: '\u00A0', // Non-breaking space
	en: '\u2002', // En space
	em: '\u2003', // Em space
	tem: '\u2004', // Three-per-em
	fem: '\u2005', // Four-per-em
	sem: '\u2006', // Six-per-em
	fig: '\u2007', // Figure space
	punct: '\u2008', // Punctuation space
	thin: '\u2009', // Thin space
	hair: '\u200A', // Hair space
	zw: '\u200B', // Zero-width
	nnb: '\u202F', // Narrow non-breaking space
	mm: '\u205F', // Medium mathematical space
	id: '\u3000', // Ideographic space
	zwnb: '\uFEFF', // Zero-width non-breaking space
});

export const MATHS = createCharacters({
	minus: '\u2212', // −
});

export const PUNCTUATION = createCharacterSet({
	common: {
		leftSided: createCharacters({
			invertedExclamation: '\u00A1', // ¡
			invertedQuestion: '\u00BF', // ¿
			invertedInterrobang: '\u2E18', // ⸘
			reversedQuestion: '\u2E2E', // ⸮
		}),
		rightSided: createCharacters({
			exclamation: '!',
			doubleExclamation: '\u203C', // ‼
			exclamationQuestion: '\u2049', // ⁉
			question: '?',
			doubleQuestion: '\u2047', // ⁇
			questionExclamation: '\u2048', // ⁈
			interrobang: '\u203D', // ‽
			dot: '.',
			comma: ',',
			ellipsis: '\u2026', // …
		}),
	},
	ru: {
		leftSided: createCharacters({
			outerQuoteOpen: '\u00AB', // «
			innerQuoteOpen: '\u201E', // „
		}),
		rightSided: createCharacters({
			outerQuoteClose: '\u00BB', // »
			innerQuoteClose: '\u201D', // “
		}),
	},
	en: {
		leftSided: createCharacters({
			outerQuoteOpen: '\u201C', // “
			innerQuoteOpen: '\u2018', // ‘
		}),
		rightSided: createCharacters({
			outerQuoteClose: '\u201D', // ”
			innerQuoteClose: '\u2019', // ’
		}),
	},
});

export const WALLET = createCharacters({
	// symbols
	anis: '¤',
	european_currency_unit: '₠',
	austral: '₳',
	cent: '¢',
	cedi: '₵',
	colon: '₡',
	dollar: '\\$',
	drachma: '₯',
	dram: '֏',
	doromi: '\u07FE',

	euro: '€',
	franc: '₣',
	guarani: '₲',
	kip: '₭',
	lari: '₾',
	naira: '₦',
	pound: '£',
	tournois: '₶',
	spesmillo: '₷',
	ruble_symbol: '₽',

	hryvnia: '₴',
	lira: '₤',
	baht: '฿',
	rupee: '₹',
	won: '₩',
	yen: '¥',
	yen_kanji: '円',
	yuan_hanzi: '元',
	dong: '₫',
	tugrik: '₮',

	tenge: '₸',
	shekel: '₪',
	manat: '₼',
	rupee_alt: '₨',
	peseta: '₧',
	peso: '₱',
	riyal: '\uFDFC',
	bitcoin_symbol: '₿',

	taka: '৳',
	tamil_rupee: '௹',
	sinhala_rupee: 'රු',

	// codes / ISO / crypto
	rub: 'RUB',
	usd: 'USD',
	eur: 'EUR',
	gbp: 'GBP',
	jpy: 'JPY',
	chf: 'CHF',
	cad: 'CAD',
	aud: 'AUD',
	nzd: 'NZD',
	pln: 'PLN',
	huf: 'HUF',

	brl: 'BRL',
	cny: 'CNY',
	twd: 'TWD',
	sgd: 'SGD',
	myr: 'MYR',
	idr: 'IDR',
	thb: 'THB',
	vnd: 'VND',
	krw: 'KRW',
	pkr: 'PKR',

	inr: 'INR',
	ils: 'ILS',
	qar: 'QAR',
	sar: 'SAR',
	aed: 'AED',
	omr: 'OMR',
	yem: 'YER',
	jod: 'JOD',
	iqd: 'IQD',
	kwd: 'KWD',

	bhd: 'BHD',
	tnd: 'TND',
	egp: 'EGP',
	syp: 'SYP',
	lbp: 'LBP',
	czk: 'CZK',
	sek: 'SEK',
	nok: 'NOK',
	dkk: 'DKK',
	hrk: 'HRK',

	rsd: 'RSD',
	bgn: 'BGN',
	ron: 'RON',
	uah: 'UAH',
	kzt: 'KZT',
	gel: 'GEL',
	amd: 'AMD',
	mxn: 'MXN',
	clp: 'CLP',
	cop: 'COP',

	ars: 'ARS',
	zar: 'ZAR',
	try: 'TRY',
	php: 'PHP',
	ngn: 'NGN',

	lkr: 'LKR',
	bdt: 'BDT',

	usdt: 'USDT',
	btc: 'BTC',
	eth: 'ETH',
	xrp: 'XRP',
	sol: 'SOL',
	bnb: 'BNB',
	usdc: 'USDC',
});
