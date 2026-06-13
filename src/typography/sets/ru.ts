import { newRule } from '@/api';
import { smartNumberGrouping, smartQuotes, wrapWithTag } from '@/functions';
import { CHARACTERS, MATHS, NONE, PUNCTUATION, SPACES, WALLET } from '@/glyphs';

import EXPRESSIONS from '../expressions/ru';

const locale = 'ru-RU';

/**
 * Russian typography ruleset.
 *
 * Extends common rules with:
 * - Russian-style smart quotes
 * - spacing normalization for punctuation
 * - em-dash formatting rules
 * - currency formatting (RUB and others)
 * - abbreviation spacing rules
 * - grammatical particle spacing rules
 *
 * Designed for Cyrillic-script normalization.
 */
export default [
	newRule('/russian/currency/wallet/symbol-flip', EXPRESSIONS.walletSymbolBeforeValue, `$2$1`),
	newRule('/russian/currency/wallet/iso-flip', EXPRESSIONS.walletISOBeforeValue, `$2$1`),
	newRule(
		'/russian/currency/wallet/symbol-value',
		EXPRESSIONS.walletSymbolAfterValue,
		`$1${SPACES.noBreak}$2`
	),
	newRule(
		'/russian/currency/wallet/iso-value',
		EXPRESSIONS.walletISOAfterValue,
		`$1${SPACES.noBreak}$2`
	),
	newRule(
		'/russian/currency/rub-to-symbol',
		/(\d+)\s*(?:рублей|рубля|рубль|руб\.?|р\.?)(?!\p{L})/giu,
		`$1${SPACES.noBreak + WALLET.SYMBOL.ruble}`
	),
	newRule(
		'/russian/currency/eur-to-symbol',
		/(\d+)\s*(?:евро)(?!\p{L})/giu,
		`$1${SPACES.noBreak + WALLET.SYMBOL.euro}`
	),
	newRule(
		'/russian/currency/usd-to-symbol',
		/(\d+)\s*(?:долларов|доллар|дол\.?)(?!\p{L})/giu,
		`$1${SPACES.noBreak + WALLET.SYMBOL.dollar}`
	),

	newRule('/russian/number/groups', smartNumberGrouping, [{ locale }]),
	newRule('/russian/number/normalize/dot->comma', /(\d+)\.(\d+)/g, '$1,$2'),

	newRule('/russian/metric/si-unit/base', EXPRESSIONS.siUnitBase, `$1${SPACES.noBreakNarrow}$2`),
	newRule('/russian/metric/si-unit/n*n-n', EXPRESSIONS.siUnitMul, `$1${CHARACTERS.middleDot}$2`),
	newRule('/russian/metric/si-unit/n-n*n', EXPRESSIONS.siUnitDiv, `$1${CHARACTERS.middleDot}$2`),
	newRule(
		'/russian/metric/si-unit/pow-after-value',
		wrapWithTag,
		[
			{
				expression: EXPRESSIONS.siUnitPowAfterNum,
				tag: 'sup',
				placement: `$1${SPACES.noBreakNarrow}$2<TAG>$3</TAG>`,
			},
		],
		-1
	),
	newRule(
		'/russian/metric/si-unit/pow',
		wrapWithTag,
		[
			{
				expression: EXPRESSIONS.siUnitPow,
				tag: 'sup',
				placement: `$1<TAG>$2</TAG>`,
			},
		],
		-1
	),
	newRule(
		'/russian/scientific/temperature/value',
		EXPRESSIONS.temperature,
		`$1${SPACES.noBreak}$2`
	),

	newRule('/russian/symbol/percent-like/value', EXPRESSIONS.percentValue, `$1${SPACES.noBreak}$2`),
	newRule('/russian/symbol/numero/value', EXPRESSIONS.numeroNumeral, (match): string => {
		const numero = match[1]!;
		const numeral = match[2]!.replace(/\s+/g, '');
		return `${numero}${SPACES.noBreakNarrow}${numeral}`;
	}),
	newRule('/russian/number/division', /(\d+\s*)(?:\/)(\s*\d+)/g, `$1${MATHS.obelus}$2`),
	newRule(
		'/russian/number/division-times',
		/(\d+\s*)(?:\/\*)(\s*\d+)/g,
		`$1${MATHS.divisionTimes}$2`
	),

	newRule(
		'/russian/punctuation/quotes',
		smartQuotes,
		[
			{
				outer: [PUNCTUATION.ru.leftSided.outerQuoteOpen, PUNCTUATION.ru.rightSided.outerQuoteClose],
				inner: [PUNCTUATION.ru.leftSided.innerQuoteOpen, PUNCTUATION.ru.rightSided.innerQuoteClose],
			},
		],
		100
	),
	newRule('/russian/punctuation/dot-after-quote', /\.»/g, '».', 1000),
	newRule(
		'/russian/punctuation/dot-after-expression',
		EXPRESSIONS.backwardsExpressiveAposiopesis,
		'$1..'
	),
	newRule('/russian/punctuation/dot-after-expression', EXPRESSIONS.expressiveAposiopesis, '$1..'),
	newRule(
		'/russian/punctuation/invalid-spacing',
		EXPRESSIONS.invalidPunctuationSpacing,
		NONE,
		1000
	),

	newRule(
		'/russian/compositions/initials',
		/([а-яёА-ЯЁ]\.)[\s]([а-яёА-ЯЁ]\.)[\s]([а-яёА-ЯЁ][а-яёА-ЯЁ]+)/g,
		`$1${SPACES.thin}$2${SPACES.thin}$3`
	),
	newRule(
		'/russian/compositions/initials',
		/([а-яёА-ЯЁ][а-яёА-ЯЁ]+)[\s]([а-яёА-ЯЁ}]\.)[\s]([а-яёА-ЯЁ]\.)/g,
		`$1${SPACES.thin}$2${SPACES.thin}$3`
	),

	newRule('/russian/text/conjunctions', /\s(б|бы|ж|же|ли|ль)(?![а-яА-Я])/gi, `${SPACES.noBreak}$1`),
	// Разделить на разные правила:
	newRule(
		'/russian/text/conjunctions',
		/\s(за|из|до|об|на|но|не|ни|то|от|по|со|или|для|над|под|при|что|если|через|после|перед|г\.|обл\.|кр\.|ст\.|пос\.|с\.|д\.|ул\.|пер\.|пр\.|пр-т\.|просп\.|пл\.|бул\.|б-р\.|наб\.|ш\.|туп\.|оф\.|кв\.|комн\.|под\.|мкр\.|уч\.|вл\.|влад\.|стр\.|корп\.|литер|эт\.|пгт\.|гл\.|рис\.|илл\.|п\.|c\.|§|АО|ОАО|ЗАО|ООО|ПАО)\s/gi,
		` $1${SPACES.noBreak}`
	),
	newRule('/russian/text/orphan-letters', /(?<![а-яА-ЯёЁ])([а-яА-ЯёЁ])\s/g, `$1${SPACES.noBreak}`),
];
