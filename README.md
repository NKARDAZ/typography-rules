# Typography Rules

> Модуль с заготовленными правилами типографики для использования в других пакетах.

## Installation

```bash
npm install @yalla/typography-rules
```

## Usage Example

Example from [@yalla/remark-typography](https://github.com/DemerNkardaz/remark-typography)

```typescript
import {
	getWeightedRules, // for get rules sorted by “weight” property
	typographyRules, // common rules list
	type FunctionRule,
	type RegExpReplaceRule,
	type RegExpTransformRule,
} from '@yalla/typography-rules';
import {
	NODE_MARKER,
	PROTECTED_PATTERNS, // for protect patterns like e-mails, ORCID, URLs, etc.
	PROTECTION_MARKER,
} from '@yalla/typography-rules/helpers';

export function remarkTypography(options: { locale?: 'ru' | 'en' } = { locale: 'ru' }) {
	return (tree: Root) => {
		const locale = options.locale as keyof typeof typographyRules;
		const rules = getWeightedRules(locale);

		if (rules.length === 0) return;

		function applyRules(text: string): string {
			let value = text;
			const protectedMatches: string[] = [];

			PROTECTED_PATTERNS.values.forEach((regex) => {
				value = value.replace(regex, (match) => {
					protectedMatches.push(match);
					return PROTECTION_MARKER;
				});
			});

			for (const item of rules) {
				if (!item || !item.kind) continue;

				switch (item.kind) {
					case 'function': {
						const funcItem = item as FunctionRule;
						value = funcItem.rule(value, ...(funcItem.args ?? []));
						break;
					}

					case 'transform': {
						const transformItem = item as RegExpTransformRule;
						value = value.replace(transformItem.rule, (match: string, ...groups: unknown[]) => {
							const regexArray = [match, ...groups] as unknown as RegExpExecArray;
							return transformItem.transform(regexArray);
						});
						break;
					}

					case 'replace': {
						const replaceItem = item as RegExpReplaceRule;
						value = value.replace(replaceItem.rule, replaceItem.replacement);
						break;
					}
				}
			}

			return value.replace(
				new RegExp(PROTECTION_MARKER, 'g'),
				() => protectedMatches.shift() || ''
			);
		}

		visit(tree, (node): VisitorResult => {
			if (EXCLUDED_TYPES.has(node.type)) {
				return SKIP;
			}

			if (!('children' in node)) {
				return;
			}

			const parent = node as Parent;

			const directTextNodes = parent.children.filter(
				(child): child is Text => child.type === 'text'
			);

			if (directTextNodes.length === 0) {
				return;
			}

			const combinedText = directTextNodes.map((n) => n.value).join(NODE_MARKER);
			const transformedText = applyRules(combinedText);
			const segments = transformedText.split(NODE_MARKER);

			directTextNodes.forEach((n, i) => {
				if (segments[i] !== undefined) {
					n.value = segments[i];
				}
			});
		});
	};
}

```

## Features

- 📦 TypeScript support
- 🚀 Fast build with tsup
- 📝 ESM and CommonJS support
- ✅ Type-safe exports
- 🧪 Vitest for testing

## Development

```bash
# Install dependencies
npm install

# Development mode with watch
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Run tests
npm run test

# UI for tests
npm run test:ui
```
