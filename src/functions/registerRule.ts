import type { Rule } from '@/types';
import { typographyRules } from '@/typography/store';

export function registerRule(locale: string, rule: Rule): void {
	if (!typographyRules[locale]) {
		typographyRules[locale] = [];
	}

	typographyRules[locale].push(rule);
}
