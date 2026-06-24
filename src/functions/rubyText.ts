import type { Node, TagSettings, RubyTextSettings } from '@/types';

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface RubyHeader {
	classNames: string[];
	style?: string | undefined;
}

/**
 * Parses an optional `@class(...)` / `@style(...)` header that may appear
 * between the wrapper-open character and the marker, e.g.
 * `@class(under center) @style(font-weight: 800)`. Order doesn't matter,
 * both, either, or neither may be present.
 */
function parseHeader(header: string): RubyHeader {
	const classMatch = header.match(/@class\(([^)]*)\)/);
	const styleMatch = header.match(/@style\(([^)]*)\)/);

	return {
		classNames: classMatch?.[1]?.trim().split(/\s+/).filter(Boolean) ?? [],
		style: styleMatch?.[1]?.trim(),
	};
}

/**
 * Resolves raw `@class()` names into final class names:
 * - `name`  -> `name`
 * - `&name` -> `<firstClassOf(baseClassName)><name>` (concatenated, no separator)
 */
function resolveClassNames(rawNames: string[], baseClassName?: string): string[] {
	const firstBaseClass = baseClassName?.trim().split(/\s+/)[0] ?? '';

	return rawNames.map((name) =>
		name.startsWith('&') ? `${firstBaseClass}${name.slice(1)}` : `${name}`
	);
}

interface OpenTag {
	index: number;
	length: number;
	header: string;
}

/** Finds the next `[<header>]:`-style opening tag at or after `fromIndex`. */
function findOpenTag(text: string, fromIndex: number, headerRe: RegExp): OpenTag | null {
	headerRe.lastIndex = fromIndex;
	const match = headerRe.exec(text);
	if (!match) return null;
	return { index: match.index, length: match[0].length, header: match[1] ?? '' };
}

/**
 * Parses ruby annotation syntax (base text and reading) and converts it to a <ruby> structure.
 * Expected format: [marker]base|text[marker]reading
 *
 * Each bracket may optionally carry a header with `@class(...)` and/or `@style(...)`
 * blocks placed between the wrapper-open character and the marker, e.g.
 * `[@class(under center):...]`. The header on the base (first) bracket targets the
 * <ruby> element; the header on the furigana (second) bracket targets the <rt> elements.
 * Plain class names become `name`; names prefixed with `&` are concatenated onto the
 * first class of the configured `className` (e.g. `&__large-font` becomes
 * `${firstClass}__large-font`).
 *
 * @param text - The input string containing ruby syntax
 * @param settings - Configuration for the marker and wrapper delimiters
 * @param tagSettings - Optional class name and attributes for the <ruby> element
 * @returns An array of nodes containing text and <ruby> components (<rb>, <rt>)
 */
export function rubyText(
	text: string,
	{ marker = ':', wrapper = ['[', ']'] }: RubyTextSettings = {},
	{ className, attrs }: TagSettings = {}
): Node[] {
	const result: Node[] = [];
	let i = 0;

	const headerRe = new RegExp(
		`${escapeRegExp(wrapper[0])}((?:@(?:class|style)\\([^)]*\\)\\s*)*)${escapeRegExp(marker)}`,
		'g'
	);

	while (i < text.length) {
		const baseTag = findOpenTag(text, i, headerRe);

		if (!baseTag) {
			result.push({ type: 'text', value: text.slice(i) });
			break;
		}

		const baseStart = baseTag.index;

		if (baseStart > i) {
			result.push({ type: 'text', value: text.slice(i, baseStart) });
		}

		let depth = 0;
		let j = baseStart;
		let baseEnd = -1;

		while (j < text.length) {
			if (text[j] === wrapper[0]) depth++;
			else if (text[j] === wrapper[1]) {
				depth--;
				if (depth === 0) {
					baseEnd = j;
					break;
				}
			}
			j++;
		}

		if (baseEnd === -1) {
			result.push({ type: 'text', value: text.slice(baseStart) });
			break;
		}

		const furiganaTag = findOpenTag(text, baseEnd + 1, headerRe);

		if (!furiganaTag || furiganaTag.index !== baseEnd + 1) {
			result.push({ type: 'text', value: text.slice(baseStart, baseEnd + 1) });
			i = baseEnd + 1;
			continue;
		}

		const furiganaStart = furiganaTag.index;

		depth = 0;
		j = furiganaStart;
		let furiganaEnd = -1;

		while (j < text.length) {
			if (text[j] === wrapper[0]) depth++;
			else if (text[j] === wrapper[1]) {
				depth--;
				if (depth === 0) {
					furiganaEnd = j;
					break;
				}
			}
			j++;
		}

		if (furiganaEnd === -1) {
			result.push({ type: 'text', value: text.slice(baseStart) });
			break;
		}

		const baseInner = text.slice(baseStart + baseTag.length, baseEnd);
		const furiganaInner = text.slice(furiganaStart + furiganaTag.length, furiganaEnd);

		const baseParts = baseInner.split('|');
		const furiganaParts = furiganaInner.split('|');

		const baseHeader = parseHeader(baseTag.header);
		const furiganaHeader = parseHeader(furiganaTag.header);

		const rubyExtraClassNames = resolveClassNames(baseHeader.classNames, className);
		const rtClassNames = resolveClassNames(furiganaHeader.classNames, className);

		const rubyClassName =
			[className, ...rubyExtraClassNames].filter(Boolean).join(' ') || undefined;
		const rtClassName = rtClassNames.join(' ') || undefined;

		const rubyAttrs = baseHeader.style ? { ...attrs, style: baseHeader.style } : attrs;
		const rtAttrs = furiganaHeader.style ? { style: furiganaHeader.style } : undefined;

		const children: Node[] = [];

		for (let k = 0; k < baseParts.length; k++) {
			children.push({
				type: 'rb',
				data: { skipTypography: true },
				children: [{ type: 'text', value: baseParts[k] ?? '' }],
			});
			children.push({
				type: 'rt',
				data: { skipTypography: true },
				...(rtClassName && { className: rtClassName }),
				...(rtAttrs && { attrs: rtAttrs }),
				children: [{ type: 'text', value: furiganaParts[k] ?? '' }],
			});
		}

		result.push({
			type: 'ruby',
			data: { skipTypography: true },
			...(rubyClassName && { className: rubyClassName }),
			...(rubyAttrs && { attrs: rubyAttrs }),
			children,
		});

		i = furiganaEnd + 1;
	}

	return result;
}
