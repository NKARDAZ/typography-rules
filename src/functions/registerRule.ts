import type { Rule } from '@/types';
import { typographyRules } from '@/typography/store';

/**
 * Registers one or more typography rules for a locale.
 *
 * @param locale Locale code (e.g. "en", "de", "fr").
 * @param rules A single rule or rules[].
 */
function registerRule(locale: string, rule: Rule): void;
function registerRule(locale: string, rules: Rule[]): void;

function registerRule(locale: string, rules: Rule | Rule[]): void {
	if (!typographyRules[locale]) {
		typographyRules[locale] = [];
	}

	if (Array.isArray(rules)) {
		typographyRules[locale].push(...rules);
	} else {
		typographyRules[locale].push(rules);
	}
}

export { registerRule };
