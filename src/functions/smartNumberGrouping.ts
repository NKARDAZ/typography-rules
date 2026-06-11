/**
 * Inserts locale-aware grouping into large numeric sequences inside text,
 * delegating all formatting to `Intl.NumberFormat`.
 *
 * @param text - Input text that may contain numbers.
 * @param locale - BCP 47 locale tag used by `Intl.NumberFormat` (e.g. `"ru"`, `"en-US"`).
 *
 * @param settings - Formatting options:
 * - `minLength` — minimum integer digit count before grouping is applied (default: 5)
 *
 * @returns Text with formatted numbers using locale-appropriate grouping separators.
 *
 * @example
 * smartNumberGrouping("Price: 1234567", "en-US");
 * // "Price: 1,234,567"
 *
 * @example
 * smartNumberGrouping("Цена: 1234567.891011", "ru");
 * // "Цена: 1 234 567,891011"
 */
export function smartNumberGrouping(text: string, { locale = 'en-US', minLength = 5 }): string {
	return text.replace(
		/(?<![\p{L}\d])([+\-\u2212]?)(\d(?:[\u00A0]?\d)*)([.,]\d+)?(?!\d)/gu,
		(match, sign: string, rawInt: string, floatPart: string | undefined) => {
			const intPart = rawInt.replace(/\u00A0/g, '');

			if (intPart.length < minLength) return match;

			// Normalise to a JS-parseable string: strip existing nbsp grouping,
			// then ensure the decimal mark is always '.' for parseFloat.
			const decimalDigits = floatPart ? floatPart.slice(1) : '';
			const normalised = decimalDigits ? `${intPart}.${decimalDigits}` : intPart;

			const num = Number(normalised);
			if (!Number.isFinite(num)) return match;

			// Let Intl decide grouping separators, decimal mark, and fractional spacing.
			const formatter = new Intl.NumberFormat(locale, {
				maximumFractionDigits: decimalDigits.length,
				minimumFractionDigits: decimalDigits.length,
			});

			return (sign === '\u2212' ? '\u2212' : sign) + formatter.format(num);
		}
	);
}
