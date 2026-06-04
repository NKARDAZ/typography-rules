import { describe, it, expect } from 'vitest';
import { greet, newRule, registerRule, smartQuotes, smartNumberSpaces, CHARACTERS } from './index';
import { typographyRules } from './typography/rules';

describe('typography-rules plugin', () => {
	it('exports the greeting helper', () => {
		expect(greet()).toBe('Hello World');
		expect(greet('Alice')).toBe('Hello Alice');
	});

	it('creates replace rules with newRule()', () => {
		const rule = newRule(/foo/g, 'bar', 5);

		expect(rule).toEqual({
			kind: 'replace',
			rule: expect.any(RegExp),
			replacement: 'bar',
			weight: 5,
		});

		if (rule.kind === 'replace') {
			expect(rule.rule.source).toBe('foo');
		}
	});

	it('creates transform rules with newRule()', () => {
		const rule = newRule(/(\d+)/g, (match) => `#${match[1]}`);

		expect(rule.kind).toBe('transform');

		if (rule.kind === 'transform') {
			expect(rule.rule).toEqual(/(\d+)/g);
			expect(rule.transform).toBeInstanceOf(Function);

			const match = rule.rule.exec('123');
			expect(match).not.toBeNull();
			if (match) {
				expect(rule.transform(match)).toBe('#123');
			}
		}
	});

	it('creates function rules with newRule()', () => {
		const rule = newRule(smartQuotes, [{ outer: ['«', '»'], inner: ['‹', '›'] }], 10);

		expect(rule.kind).toBe('function');

		if (rule.kind === 'function') {
			expect(rule.rule).toBe(smartQuotes);
			expect(rule.args).toEqual([{ outer: ['«', '»'], inner: ['‹', '›'] }]);
			expect(rule.weight).toBe(10);
		}
	});

	it('registerRule adds a locale rule array', () => {
		const locale = `test-locale-${Date.now()}`;
		const rule = newRule(/test/g, 'ok');

		registerRule(locale, rule);

		expect(typographyRules[locale]).toBeDefined();
		expect(typographyRules[locale]).toContain(rule);
	});

	it('formats smart quotes and preserves apostrophes', () => {
		expect(smartQuotes('"Привет \'мир\'"')).toBe('«Привет „мир“»');
		expect(smartQuotes('"Hello \'world\'"', { outer: ['“', '”'], inner: ['‘', '’'] })).toBe(
			'“Hello ‘world’”'
		);
		expect(smartQuotes("It's fine")).toBe("It's fine");
	});

	it('inserts non-breaking spaces for large numbers', () => {
		expect(smartNumberSpaces('12345')).toBe(`12${CHARACTERS.no_break_space}345`);
		expect(smartNumberSpaces('1000000.1234', { separateFloat: true })).toBe(
			`1${CHARACTERS.no_break_space}000${CHARACTERS.no_break_space}000.123${CHARACTERS.no_break_space}4`
		);
	});

	it('includes common locales in typographyRules', () => {
		expect(typographyRules).toHaveProperty('common');
		expect(typographyRules).toHaveProperty('ru');
		expect(typographyRules).toHaveProperty('en');
		expect(Array.isArray(typographyRules.common)).toBe(true);
	});
});
