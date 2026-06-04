import { CHARACTERS } from '@/storage';
import type { NumberSpaceSettings } from '@/types';

export function smartNumberSpaces(
	text: string,
	{ minLength = 5, separateFloat = false }: NumberSpaceSettings = {}
): string {
	return text.replace(
		/(?<![a-zA-Zа-яА-ЯёЁ\d])([+\-\u2212]?)(\d[\d\u00A0]*)([.,]\d+)?(?!\d)/g,
		(match, sign: string, rawInt: string, floatPart: string | undefined) => {
			const intPart = rawInt.replace(/\u00A0/g, '');

			if (intPart.length < minLength) return match;

			const formattedInt = intPart.replace(/(\d)(?=(\d{3})+$)/g, `$1${CHARACTERS.no_break_space}`);

			let formattedFloat = floatPart ?? '';
			if (separateFloat && floatPart) {
				const sep = floatPart[0]; // '.' или ','
				const digits = floatPart.slice(1);
				const spaced = digits.replace(/(\d{3})(?=\d)/g, `$1${CHARACTERS.no_break_space}`);
				formattedFloat = sep + spaced;
			}

			return sign + formattedInt + formattedFloat;
		}
	);
}

export default smartNumberSpaces;
