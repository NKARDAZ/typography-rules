/**
 * Creates a normalized alias map with utility methods.
 * All keys and values are automatically lowercased on creation.
 *
 * @param map - An object where each key is a root alias and its value is an array of alternative names.
 * @returns A Proxy object providing direct key access and alias resolution methods.
 *
 * @example
 * const ALIAS = createAlias({
 *   en: ['en-US', 'English'],
 *   ru: ['ru-RU', 'Russian'],
 * });
 *
 * ALIAS.en                  // ['en-us', 'english']
 * ALIAS.resolve('English')  // 'en'
 * ALIAS.has('ru-RU')        // true
 */
export function createAlias<T extends Record<string, string[]>>(map: T) {
	const normalized: Record<string, string[]> = Object.fromEntries(
		Object.entries(map).map(([key, values]) => [
			key.toLowerCase(),
			values.map((v) => v.toLowerCase()),
		])
	);

	const methods = {
		/**
		 * Checks whether an alias exists in the map,
		 * either as a root key or as an alternative name.
		 *
		 * @param alias - The alias to look up (case-insensitive).
		 * @returns `true` if the alias is found, `false` otherwise.
		 *
		 * @example
		 * ALIAS.has('English') // true
		 * ALIAS.has('fr')      // false
		 */
		has(alias: string): boolean {
			const a = alias.toLowerCase();
			if (a in normalized) return true;
			return Object.values(normalized).some((vals) => vals.includes(a));
		},
		/**
		 * Resolves an alias to its root key.
		 *
		 * @param alias - The alias to resolve (case-insensitive).
		 * @returns The root key if found, `undefined` otherwise.
		 *
		 * @example
		 * ALIAS.resolve('Russian') // 'ru'
		 * ALIAS.resolve('ru-RU')   // 'ru'
		 * ALIAS.resolve('fr')      // undefined
		 */
		resolve(alias: string): string | undefined {
			const a = alias.toLowerCase();
			if (a in normalized) return a;
			return Object.keys(normalized).find((k) => {
				const values = normalized[k];
				return Array.isArray(values) && values.includes(a);
			});
		},
		/**
		 * Adds one or more alternative names to an existing or new root key.
		 * All values are automatically lowercased.
		 *
		 * @param root - The root key to add aliases to.
		 * @param aliases - One or more alternative names to register.
		 *
		 * @example
		 * ALIAS.push('ru', 'Рус', 'ру')
		 * ALIAS.ru // ['ru-ru', 'russian', 'русский', 'рус', 'ру']
		 */
		push(root: string, ...aliases: string[]) {
			for (const alias of aliases) {
				const a = alias.toLowerCase();
				const r = root.toLowerCase();
				if (a in normalized) {
					normalized[a]?.push(r);
				} else {
					normalized[a] = [r];
				}
			}
		},
		/**
		 * Normalizes one or more strings to lowercase.
		 *
		 * @param alias - One or more strings to normalize.
		 * @returns An array of lowercased strings.
		 *
		 * @example
		 * ALIAS.normalize('English', 'RU-RU') // ['english', 'ru-ru']
		 */
		normalize(...alias: string[]): string[] {
			return alias.map((a) => a.toLowerCase());
		},
	};

	return new Proxy(methods, {
		get(target, prop: string) {
			if (prop in target) return target[prop as keyof typeof target];
			return normalized[prop];
		},
		has(_target, prop: string) {
			return prop in normalized;
		},
		ownKeys() {
			return [...Object.keys(normalized), ...Object.keys(methods)];
		},
		getOwnPropertyDescriptor(_target, prop: string) {
			if (prop in normalized || prop in methods) {
				return { enumerable: true, configurable: true };
			}
			return undefined;
		},
	}) as typeof methods & { [K in keyof T]: string[] };
}

/**
 * Global alias map for supported locales.
 *
 * Provides normalized access to locale identifiers and their alternatives.
 * All lookups are case-insensitive.
 *
 * @example
 * ALIAS.ru                  // ['ru-ru', 'russian', 'русский']
 * ALIAS.resolve('Русский')  // 'ru'
 * ALIAS.has('Old English')  // true
 */
export const ALIAS = createAlias({
	ru: ['ru-RU', 'Russian', 'Русский'],
	en: ['en-US', 'English'],
	ang: ['Ænglisċ', 'Ænglisc', 'Old English'],
});
