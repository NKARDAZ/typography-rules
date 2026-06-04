import type { Rule } from '@/types';
import { typographyRules } from '@/typography/rules';

export function registerRule(locale: string, rule: Rule) {
	if (!typographyRules[locale]) {
		typographyRules[locale] = [];
	}

	typographyRules[locale].push(rule);
}

export default registerRule;
