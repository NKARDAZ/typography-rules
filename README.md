# Typography Rules

Module with ready-to-use typography rules for use in other packages.

## Installation

```bash
npm i @yalla/typography-rules
```

## Usage

Example: [@yalla/remark-typography](https://github.com/DemerNkardaz/remark-typography/blob/main/src/index.ts)

After importing the module, you need to explicitly initialize the default rules if they are needed:

```typescript
import { applyDefaultRules } from '@yalla/typography-rules';

applyDefaultRules();
```

Or you can create your own rules (or combine them with the default ones) and apply them:

```typescript
import { newRule, registerRule } from '@yalla/typography-rules';

registerRule('en', [
	newRule(/test/g, 'ok'),
])
```
