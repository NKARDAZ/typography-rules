import { CHARACTERS } from '@/glyphs';
import { PARTS as COMMON_PARTS, EXPRESSIONS as COMMON_EXPRESSIONS } from './common';

const PARTS = {
	...COMMON_PARTS,
};

const EXPRESSIONS = {
	...COMMON_EXPRESSIONS,
	numeroNumeral: new RegExp(`(${CHARACTERS.numero})\\s+(${PARTS.numerals})`, 'g'),
};

export default EXPRESSIONS;
