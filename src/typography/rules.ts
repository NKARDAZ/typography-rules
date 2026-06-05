import { newRule, smartNumberSpaces, smartQuotes } from '@/functions';
import { CHARACTERS, PUNCTUATION, WALLET } from '@/storage';
import { typographyRules } from './store';

typographyRules['common'] = [
	// Whitespace cleanup
	newRule(/  +/g, ' '),
	newRule(/^\s|\s$/g, ''),

	// Dashes and special chars
	newRule(/(?<!\d)-(\d+)/g, `${CHARACTERS.minus}$1`),
	newRule(/(\d+)-(\d+)/g, `$1${CHARACTERS.endash}$2`),
	newRule(
		/(\d+|[XIVCMLDZ\u2160-\u2188]+)-(\d+|[XIVCMLDZ\u2160-\u2188]+)/g,
		`$1${CHARACTERS.endash}$2`
	),
	newRule(
		new RegExp(
			`([${CHARACTERS.minus}${CHARACTERS.emdash}-])(\\d+)[${CHARACTERS.minus}${CHARACTERS.endash}\\-]([${CHARACTERS.minus}${CHARACTERS.endash}\\-]?\\d+)`,
			'g'
		),
		`$1$2${CHARACTERS.ellipsis}$3`
	),
	newRule(/--/g, CHARACTERS.emdash),
	newRule(/\.\.\./g, CHARACTERS.ellipsis),

	// Numbers
	newRule(smartNumberSpaces, []),

	// Apostrophe — runs after smartQuotes (weight 100) so only untouched ' remain
	newRule(/'/g, '\u2019', 200),
];

typographyRules['ru'] = [
	// 0::Разное
	newRule(/(\d+)[\s\u00A0](%|\u2030|\u2031)/g, '$1$2'),
	newRule(smartQuotes, [], 100),
	newRule(
		new RegExp(
			`(?<=[${PUNCTUATION.leftSided}«„\\(\\[])\\s+|(?<!\\s)\\s(?=[${PUNCTUATION.rightSided}»“\\)\\]])`,
			'g'
		),
		'',
		1000
	),
	newRule(/\.»/g, '».', 1000),
	newRule(
		new RegExp(
			`(?<!\\d\\s)([${WALLET.join()}])\\s(\\d{1,3}(?:\\d{3})*(?:,\\d+)?|\\d+(?:,\\d+)?)`,
			'g'
		),
		`$2${CHARACTERS.no_break_space}$1`
	),
	newRule(new RegExp(`(\\d+)\\s([${WALLET.join()}])`, 'g'), `$1${CHARACTERS.no_break_space}$2`),

	// 1::Тире
	newRule(new RegExp(`^(${CHARACTERS.emdash})\\s`, 'gm'), `$1${CHARACTERS.no_break_space}`),
	newRule(
		new RegExp(`(?<=[${PUNCTUATION.rightSided}])\\s${CHARACTERS.emdash}\\s`, 'g'),
		`${CHARACTERS.no_break_space}${CHARACTERS.emdash}${CHARACTERS.no_break_space}`
	),
	newRule(
		new RegExp(`(?<![${PUNCTUATION.rightSided}])\\s${CHARACTERS.emdash}\\s`, 'g'),
		`${CHARACTERS.no_break_space}${CHARACTERS.emdash} `
	),

	// 3::Инициалы
	newRule(
		/([A-ZА-ЯЁ]\.)[\s]([A-ZА-ЯЁ]\.)[\s]([A-ZА-ЯЁ][a-zа-яё]+)/g,
		`$1${CHARACTERS.thin_space}$2${CHARACTERS.thin_space}$3`
	),
	newRule(
		/([A-ZА-ЯЁ][a-zа-яё]+)[\s]([A-ZА-ЯЁ]\.)[\s]([A-ZА-ЯЁ]\.)/g,
		`$1${CHARACTERS.thin_space}$2${CHARACTERS.thin_space}$3`
	),

	// 4::Союзы и прочее
	newRule(/\s(б|бы|ж|же|ли|ль)(?![а-яА-Я])/gi, `${CHARACTERS.no_break_space}$1`),
	newRule(
		/\s(за|из|до|об|на|но|не|ни|то|от|по|со|или|для|над|под|при|что|если|через|после|перед|г\.|обл\.|кр\.|ст\.|пос\.|с\.|д\.|ул\.|пер\.|пр\.|пр-т\.|просп\.|пл\.|бул\.|б-р\.|наб\.|ш\.|туп\.|оф\.|кв\.|комн\.|под\.|мкр\.|уч\.|вл\.|влад\.|стр\.|корп\.|литер|эт\.|пгт\.|гл\.|рис\.|илл\.|п\.|c\.|№|§|АО|ОАО|ЗАО|ООО|ПАО)\s/gi,
		` $1${CHARACTERS.no_break_space}`
	),

	// 5::Одиночные буквы
	newRule(/(?<![а-яА-ЯёЁa-zA-Z])([а-яА-ЯёЁa-zA-Z])\s/g, `$1${CHARACTERS.no_break_space}`),

	// 6::Конец абзаца
	newRule(
		new RegExp(
			`(?<=[а-яА-ЯёЁa-zA-Z])\\s(?=[а-яА-ЯёЁa-zA-Z]{1,12}[${PUNCTUATION.rightSided}]*$)`,
			'gm'
		),
		CHARACTERS.no_break_space
	),
];

typographyRules['en'] = [
	newRule(smartQuotes, [{ outer: ['“', '”'], inner: ['‘', '’'] }], 100),
	newRule(
		new RegExp(
			`(?<=[${PUNCTUATION.leftSided}“‘\\(\\[])\\s+|(?<!\\s)\\s(?=[${PUNCTUATION.rightSided}”’\\)\\]])`,
			'g'
		),
		'',
		1000
	),
	newRule(new RegExp(`([${WALLET.join()}])\\s?(\\d+)`, 'g'), `$1$2`),
	newRule(/fi/g, '\uFB01'),
	newRule(/fl/g, '\uFB02'),
	newRule(/ffi/g, '\uFB03'),
	newRule(/ffl/g, '\uFB04'),
];
