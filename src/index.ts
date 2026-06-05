import { applyDefaultRules, defaultRuleKeys } from './typography/rules';

for (const key of defaultRuleKeys) {
	applyDefaultRules(key);
}

export * from './functions';
export * from './typography/rules';
export * from './typography/store';
export type * from './types';
