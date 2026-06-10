import type {
	FunctionRule,
	RegExpReplaceRule,
	RegExpTransformRule,
	Rule,
	RuleFunction,
} from '@/types';

/**
 * Creates a **replace** rule — every match is substituted with a literal string.
 *
 * The resulting rule is used in typography pipelines to transform text.
 *
 * @param label - Human-readable identifier for the rule
 * @param rule - RegExp pattern to match against
 * @param replacement - Literal string used as replacement for every match
 * @param weight - Priority of the rule (higher = applied later)
 *
 * @returns `RegExpReplaceRule`
 *
 * @example
 * newRule('em-dash', /--/g, '-');
 */
function newRule(label: string, rule: RegExp, replacement: string, weight?: number): Rule;

/**
 * Creates a **transform** rule — replacement is computed dynamically from the match.
 *
 * The resulting rule is used in typography pipelines to transform text.
 *
 * @param label - Human-readable identifier for the rule
 * @param rule - RegExp pattern to match against
 * @param transform - Callback receiving the full `RegExpExecArray`; return value replaces the matched substring
 * @param weight - Priority of the rule (higher = applied later)
 *
 * @returns `RegExpTransformRule`
 *
 * @example
 * newRule('wrap-digits', /\d+/g, m => `[${m[0]}]`);
 */
function newRule(
	label: string,
	rule: RegExp,
	transform: (match: RegExpExecArray) => string,
	weight?: number
): Rule;

/**
 * Creates a **function** rule — custom logic with forwarded arguments.
 *
 * The resulting rule is used in typography pipelines to transform text.
 *
 * @param label - Human-readable identifier for the rule
 * @param rule - Custom rule function — receives `args` at call time
 * @param args - Arguments forwarded to the rule function when applied
 * @param weight - Priority of the rule (higher = applied later)
 *
 * @returns `FunctionRule`
 *
 * @example
 * newRule('custom', myRuleFn, ['arg1', 'arg2']);
 */
function newRule(label: string, rule: RuleFunction, args?: unknown[], weight?: number): Rule;

function newRule(
	label: string,
	rule: RegExp | RuleFunction,
	second?: string | ((match: RegExpExecArray) => string) | unknown[],
	weight = 0
): Rule {
	if (typeof rule === 'function') {
		return {
			label,
			kind: 'function',
			rule,
			args: Array.isArray(second) ? second : [],
			weight,
		} as FunctionRule;
	}

	if (typeof second === 'string') {
		return {
			label,
			kind: 'replace',
			rule: rule as RegExp,
			replacement: second,
			weight,
		} as RegExpReplaceRule;
	}

	return {
		label,
		kind: 'transform',
		rule: rule as RegExp,
		transform: second as (match: RegExpExecArray) => string,
		weight,
	} as RegExpTransformRule;
}

export { newRule };
