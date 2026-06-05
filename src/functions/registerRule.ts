import type { Rule } from '@/types';
import { typographyRules } from '@/typography/store';

function registerRule(locale: string, rule: Rule): void;
function registerRule(locale: string, rules: Rule[]): void;

function registerRule(locale: string, ruleOrRules: Rule | Rule[]): void {
	if (!typographyRules[locale]) {
		typographyRules[locale] = [];
	}

	if (Array.isArray(ruleOrRules)) {
		typographyRules[locale].push(...ruleOrRules);
	} else {
		typographyRules[locale].push(ruleOrRules);
	}
}

export { registerRule };
