import { PUNCTUATION, CHARACTERS } from '@/glyphs';

import { PARTS as COMMON_PARTS, EXPRESSIONS as COMMON_EXPRESSIONS } from './common';

const PARTS = {
	...COMMON_PARTS,
	leftPunctuation: `${RegExp.escape(PUNCTUATION.get('en', 'leftSided').join(''))}`,
	rightPunctuation: `${RegExp.escape(PUNCTUATION.get('en', 'rightSided').join(''))}`,

	get leftChars(): string {
		const value = PARTS.leftPunctuation + PARTS.leftBrackets;
		Object.defineProperty(this, 'leftChars', { value, enumerable: true, configurable: false });
		return value;
	},
	get rightChars(): string {
		const value = PARTS.rightPunctuation + PARTS.rightBrackets;
		Object.defineProperty(this, 'rightChars', { value, enumerable: true, configurable: false });
		return value;
	},
} as const;

const EXPRESSIONS = {
	...COMMON_EXPRESSIONS,
	numberNumeral: new RegExp(`(${CHARACTERS.number})\\s+(${PARTS.numerals})`, 'g'),
	invalidPunctuationSpacing: new RegExp(
		`(?<=[${PARTS.leftChars}])\\s+|(?<!\\s)\\s(?=[${PARTS.rightChars}])`,
		'g'
	),
} as const;

export default EXPRESSIONS;
