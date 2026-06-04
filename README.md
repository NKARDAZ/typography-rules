# Typography Rules

> Модуль с заготовленными правилами типографики для использования в других пакетах.

## Installation

```bash
npm install @yalla/typography-rules
```

## Usage Example

```typescript
// Import sorted by weight version of typographyRules const
import { getWeightedRules, typographyRules } from '@yalla/typography-rules';

export function remarkTypography(options: { locale?: 'ru' | 'en' } = { locale: 'ru' }) {
	return (tree: Root) => {
		const locale = options.locale as keyof typeof typographyRules;

		const rules = getWeightedRules(locale);

		if (rules.length === 0) return;

		function applyRules(text: string): string {
			let value = text;
			// Here you logic for applying rules to the text
			return value;
		}
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
