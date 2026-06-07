# @yalla/typography-rules

A modular, locale-aware typography rules engine for transforming plain text into
typographically correct output. Ships with a glyph registry, smart text
functions, and a composable rule pipeline.

Used as a rules provider for typography plugins such as
[@yalla/remark-typography](https://github.com/DemerNkardaz/remark-typography).

---

## Installation

```bash
npm i @yalla/typography-rules
```

> **Requires Node.js ≥ 24.0.0**

---

## Package Exports

| Export path                       | Description                                                               |
| --------------------------------- | ------------------------------------------------------------------------- |
| `@yalla/typography-rules`         | Main entry — rules, store, types, functions                               |
| `@yalla/typography-rules/glyphs`  | Glyph registries (DASHES, SPACES, PUNCTUATION, …)                         |
| `@yalla/typography-rules/helpers` | Text pipeline helpers (protect/unprotect, node markers, pattern registry) |

---

## Quick Start

### Using default rules

```typescript
import { applyDefaultRules, getWeightedRules } from '@yalla/typography-rules';

// Register all built-in rule groups (common, ru, en, …)
applyDefaultRules();

// Or apply only a specific locale group
applyDefaultRules('ru');

// Retrieve the merged, weight-sorted pipeline for a locale
const rules = getWeightedRules('ru'); // common + ru rules, sorted by weight
```

### Defining custom rules

```typescript
import { newRule, registerRule } from '@yalla/typography-rules';

// Replace rule — static string substitution
registerRule('en', newRule(/\(c\)/gi, '©'));

// Transform rule — dynamic replacement per match
registerRule(
  'en',
  newRule(/\d+/g, (match) => `[${match[0]}]`)
);

// Function rule — full custom processing function
import { smartQuotes } from '@yalla/typography-rules';

// Danish quotes: »Jeg husker, at hun sagde ›det her er vigtigt‹ i går.«
registerRule(
  'da',
  newRule(smartQuotes, [{ outer: ['»', '«'], inner: ['›', '‹'] }])
);
```

### Registering multiple rules at once

```typescript
import { newRule, registerRule } from '@yalla/typography-rules';
import { DASHES } from '@yalla/typography-rules/glyphs';

registerRule(
  'en',
  newRule(/--/g, DASHES.em),
  newRule(/\(r\)/gi, '®'),
  newRule(/\(tm\)/gi, '™')
);
```

---

## Core API

### `newRule(rule, second?, weight?)`

Creates a typed typography rule object. Supports three overloads:

```typescript
// 1. Replace rule
newRule(/--/g, '—');

// 2. Transform rule
newRule(/\d+/g, (match: RegExpExecArray) => `[${match[0]}]`);

// 3. Function rule
newRule(myFunction, ['arg1', 'arg2']);
```

| Parameter | Type                               | Description                                                |
| --------- | ---------------------------------- | ---------------------------------------------------------- |
| `rule`    | `RegExp \| RuleFunction`           | Pattern or processing function                             |
| `second`  | `string \| transform fn \| args[]` | Replacement, transformer, or arguments                     |
| `weight`  | `number`                           | Execution priority — lower values run first (default: `0`) |

---

### `registerRule(locale, rules[])`

Registers one or more rules for a locale. Automatically invalidates the weighted
rule cache for that locale and `'common'`.

```typescript
registerRule('common', newRule(/\s+/g, ' '));
registerRule('de', newRule(/--/g, '—'), newRule(/"/g, '„'));
```

---

### `applyDefaultRules(from?)`

Populates the global rule registry with the built-in default ruleset.

```typescript
applyDefaultRules(); // All locales
applyDefaultRules('en'); // English rules only
applyDefaultRules('ru'); // Russian rules only
```

---

### `getWeightedRules(locale)`

Returns a merged, weight-sorted rule pipeline for the given locale: `common`
rules + locale-specific rules, sorted ascending by `weight`.

```typescript
const pipeline = getWeightedRules('en'); // Rule[]
```

---

### `resetTypographyRules()`

Clears all registered rules from the global registry and cache.

---

### `rulesHas(locale)` / `rulesCount(locale)`

Utility functions for inspecting the rule registry:

```typescript
rulesHas('en'); // boolean
rulesCount('en'); // number
```

---

## Built-in Functions

These are composable text-processing functions that can be used directly or
wrapped with `newRule`.

### `smartQuotes(text, settings?)`

Converts straight quotes (`"` and `'`) into typographically correct
opening/closing quote pairs, with support for nested quotation levels and
apostrophe detection.

```typescript
import { smartQuotes } from '@yalla/typography-rules';

smartQuotes('"Hello"'); // “Hello” (en defaults)
smartQuotes('"He said \'hi\'"'); // “He said ‘hi’”
```

**Settings:**

| Option  | Type               | Default            | Description                      |
| ------- | ------------------ | ------------------ | -------------------------------- |
| `outer` | `[string, string]` | `[“, ”]` (English) | Opening and closing outer quotes |
| `inner` | `[string, string]` | `[‘, ’]` (English) | Opening and closing inner quotes |

---

### `smartNumberGrouping(text, settings?)`

Inserts non-breaking spaces (or another character, e.g. `,`) as thousands
separators into large numeric sequences.

```typescript
import { smartNumberGrouping } from '@yalla/typography-rules';

smartNumberGrouping('Price: 1234567');
// "Price: 1 234 567"

smartNumberGrouping('Value: 1234567.891011', { separateFloat: true });
// "Value: 1 234 567.891 011"
```

**Settings:**

| Option          | Type               | Default                     | Description                                            |
| --------------- | ------------------ | --------------------------- | ------------------------------------------------------ |
| `minLength`     | `number`           | `5`                         | Minimum digit count before spacing is applied          |
| `separateFloat` | `boolean`          | `false`                     | Whether to group digits in the fractional part as well |
| `separator`     | `Spaces \| string` | `SPACES.noBreak` (`\u00A0`) | Character inserted as a thousands separator            |

---

### `clearSpaces(text, settings?)`

Collapses runs of two or more identical space characters into a single one. By
default targets non-breaking, hair, and thin spaces.

```typescript
import { clearSpaces } from '@yalla/typography-rules';

clearSpaces('a  b  c'); // 'a b c'
```

**Settings:**

| Option   | Type                   | Default                 | Description                     |
| -------- | ---------------------- | ----------------------- | ------------------------------- |
| `spaces` | `Spaces[] \| string[]` | `[noBreak, hair, thin]` | Space characters to deduplicate |

---

### `runt(text, settings?)`

Prevents typographic runts — single short words isolated at the end of a
paragraph — by replacing the preceding space with a non-breaking space. For
longer last words, also protects the penultimate word.

**Settings:**

| Option      | Type               | Default          | Description                                                          |
| ----------- | ------------------ | ---------------- | -------------------------------------------------------------------- |
| `threshold` | `number`           | `10`             | Maximum character length of the last word to trigger runt protection |
| `space`     | `Spaces \| string` | `SPACES.noBreak` | Replacement space character                                          |

---

## Glyphs

The `@yalla/typography-rules/glyphs` export provides typed, prototype-enhanced
glyph registries. All registries support shared utility methods.

### Available registries

| Export         | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| `DASHES`       | Em dash, en dash, soft hyphen, figure dash, non-breaking hyphen, etc.           |
| `SPACES`       | All Unicode space variants — non-breaking, thin, hair, narrow, zero-width, etc. |
| `PUNCTUATION`  | Multi-locale quote characters, ellipsis, interrobang, and punctuation marks     |
| `MATHS`        | Minus sign (`−`), fraction slash (`⁄`)                                          |
| `LIGATURES`    | Typographic ligatures: fi, fl, ffi, ffl, Æ, Œ, etc.                             |
| `CHARACTERS`   | Dagger, double dagger, numero (`№`), section sign (`§`), etc.                   |
| `TEMPERATURES` | Temperature unit symbols: ℃, ℉, K and text forms                                |
| `WALLET`       | Currency symbols and ISO 4217 codes                                             |
| `DIGITS`       | ASCII digits and Unicode Roman numeral characters                               |
| `RANGES`       | Character range strings for use in RegExp character classes                     |

### GlyphSet utility methods

All glyph sets expose the following methods:

```typescript
DASHES.join(); // '—|–|⸺|…' — joined string of all values
DASHES.join(''); // '—–⸺…'
DASHES.hasKey('em'); // true
DASHES.hasValue('—'); // true
DASHES.findKey('—'); // 'em'
DASHES.find('em', 'en'); // ['—', '–']
DASHES.insert({ myDash: '\u2E1A' }); // mutably extend the set
```

### PUNCTUATION locale access

```typescript
import { PUNCTUATION } from '@yalla/typography-rules/glyphs';

PUNCTUATION.get('ru', 'leftSided'); // common + ru leftSided merged
PUNCTUATION.get('en', 'rightSided'); // common + en rightSided merged
PUNCTUATION.getList(); // ['common', 'ru', 'en', 'fr', 'is']
PUNCTUATION.hasKey('de'); // false
```

**Supported locales in PUNCTUATION:**

| Locale | Outer quotes    | Inner quotes      |
| ------ | --------------- | ----------------- |
| `ru`   | &laquo;…&raquo; | &bdquo;…&ldquo;   |
| `en`   | &ldquo;…&rdquo; | &lsquo;…&rsquo;   |
| `fr`   | &laquo;…&raquo; | &lsaquo;…&rsaquo; |
| `is`   | &bdquo;…&ldquo; | &sbquo;…&lsquo;   |

---

## Helpers

The `@yalla/typography-rules/helpers` export provides utilities for safe text
pipeline construction.

### Protection system

Temporarily wraps structured content (URLs, emails, code, identifiers) in
protection markers before typography transformations, then restores originals
afterward.

```typescript
import { protect, unprotect } from '@yalla/typography-rules/helpers';

const [protected, captured] = protect(text);
// ... apply typography rules to `protected` ...
const result = unprotect(processed, captured);
```

**Protected patterns** (not modified by typography rules):

- Email addresses, URLs
- Unix and Windows file paths
- XML/HTML tags
- Inline and block code (backtick syntax)
- UUIDs, git hashes
- IPv4, IPv6, MAC addresses
- Version strings (`v1.2.3`, etc.)
- CSS selectors, CLI flags (`--option`)
- ISBN, ISSN, DOI, ORCID identifiers

### Pattern registry

```typescript
import { createPatterns, PROTECTED_PATTERNS } from '@yalla/typography-rules/helpers';

const PATTERNS = createPatterns({
  email: /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g,
  url: /https?:\/\/[^\s]+/g,
});

PATTERNS.email;            // fresh RegExp instance (lastIndex = 0) on every access
[...PATTERNS];             // [RegExp, RegExp]
PATTERNS.combined();       // single alternation RegExp
PATTERNS.insert({ ... });  // extend with new patterns
```

### Node markers

Used to join/split text nodes across boundaries during multi-node processing:

```typescript
import {
  joinNodes,
  splitNodes,
  NODE_MARKER,
} from '@yalla/typography-rules/helpers';

const joined = joinNodes(nodes); // 'text1\uE000\uEDFD\uF43Etext2'
// ... apply rules to `joined` ...
splitNodes(processed, nodes); // writes segments back to nodes
```

---

## Default Rules Reference

### Common (applied to all locales)

| Pattern / Trigger                                                    | Replacement                          | Description                                                                                         |
| -------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Multiple identical spaces (`\u00A0{2,}`, `\u200A{2,}`, `\u2009{2,}`) | Single space                         | Collapses duplicate non-breaking, hair, and thin spaces via `clearSpaces`                           |
| Leading / trailing whitespace (`^\s` or `\s$`)                       | _(removed)_                          | Trims surrounding whitespace from the processed text                                                |
| Hyphen-minus before digit (`-123`)                                   | Minus sign + digit (`−123`)          | Replaces ASCII hyphen-minus with proper Unicode minus sign `−` (`\u2212`) in negative numbers       |
| Digit range with hyphen (`1-2`)                                      | En dash range (`1–2`)                | Converts hyphen between two integer sequences into an en dash                                       |
| Number–number with en dash or minus (`−2–3`)                         | Ellipsis range (`−2…3`)              | Converts numeric ranges using en dash or minus into ellipsis notation                               |
| Double hyphen (`--`)                                                 | Em dash (`—`)                        | Replaces double hyphen-minus with a typographic em dash                                             |
| Four or more consecutive dots (`....`)                               | Three dots (`...`)                   | Normalizes over-long dot sequences before ellipsis conversion                                       |
| Three dots (`...`)                                                   | Ellipsis (`…`)                       | Converts ASCII triple-dot into the Unicode ellipsis character `…` (`\u2026`)                        |
| Two or more consecutive ellipses (`……`)                              | Single ellipsis (`…`)                | Deduplicates repeated ellipsis characters                                                           |
| Straight apostrophe / right single quote (`'`)                       | Typographic apostrophe (`’`)         | Replaces ASCII apostrophe with the Unicode right single quotation mark `'` (`\u2019`), weight `200` |
| Short last word(s) in a paragraph                                    | Preceding space → non-breaking space | `runt`: prevents widows/runts by tying the last short word(s) to the preceding word                 |

---

### Russian (`ru`)

_Rules coming soon._

| Pattern / Trigger | Replacement | Description |
| ----------------- | ----------- | ----------- |
| —                 | —           | —           |

---

### English (`en`)

_Rules coming soon._

| Pattern / Trigger | Replacement | Description |
| ----------------- | ----------- | ----------- |
| —                 | —           | —           |

---

## Rule Weights

Rules are applied in ascending weight order. Rules with equal weight preserve
their registration order (stable sort).

| Weight        | Meaning                                                           |
| ------------- | ----------------------------------------------------------------- |
| `0` (default) | Standard priority                                                 |
| `< 0`         | Applied before standard rules                                     |
| `> 0`         | Applied after standard rules                                      |
| `200`         | Late-stage — e.g. apostrophe normalization after quote processing |

---

## TypeScript

The package is fully typed. Key exported types:

```typescript
import type {
  Rule,
  RegExpReplaceRule,
  RegExpTransformRule,
  FunctionRule,
  RuleFunction,
  QuoteSettings,
  NumberSpaceSettings,
  ClearSpacesSettings,
  runtSettings,
} from '@yalla/typography-rules';
```
