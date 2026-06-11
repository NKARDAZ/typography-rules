import type { Rule } from '@/types';
import { ALIAS } from '@/typography/aliases';
import { typographyRules } from '@/typography/store';

interface LabelTransform {
	expression: RegExp;
	replacement: string;
}

/**
 * Registers one or more typography rules for a locale.
 *
 * Automatically invalidates the weighted rules cache
 * for the affected locale and “common”.
 *
 * @param locale Locale code (e.g. "en", "de", "fr").
 * @param rules A sequence of rules[].
 */
function registerRule(locale: string, ...rules: Rule[]): void;

function registerRule(locale: string, ...rules: Rule[]): void {
	const key = ALIAS.resolve(locale) ?? locale;

	if (!typographyRules[key]) typographyRules[key] = [];

	typographyRules[key]!.push(...rules);
}

/**
 * Registers rules for a locale, inheriting from a base locale.
 *
 * @param locale Locale code to register rules for (e.g. "fr", "de").
 * @param base Locale code to inherit rules from (e.g. "en").
 * @param options.label Optional transform applied to each inherited rule's label.
 * @param options.excludes Rule labels to exclude from the base.
 * @param rules Additional rules to register on top of the inherited ones.
 */
function rulesBase(
	locale: string,
	base: string,
	label?: LabelTransform,
	excludes?: string[],
	...rules: Rule[]
): void {
	const localeKey = ALIAS.resolve(locale) ?? locale;
	const baseKey = ALIAS.resolve(base) ?? base;

	const baseRules = (typographyRules[baseKey] ?? [])
		.filter((rule) => !excludes?.includes(rule.label))
		.map((rule) => {
			if (!label) return rule;

			const shallow = { ...rule };
			if (shallow.label) {
				shallow.label = shallow.label.replace(label.expression, label.replacement);
			}

			return shallow;
		});

	registerRule(localeKey, ...baseRules, ...rules);
}

export { registerRule, rulesBase };
