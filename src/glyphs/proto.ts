import type { GlyphData, GlyphStringMap } from '.';

export const proto = {
	values(this: GlyphStringMap): string[] {
		return Object.values(this);
	},
	join(this: GlyphStringMap, joiner = '|'): string {
		return Object.values(this).join(joiner);
	},
	insert(this: GlyphStringMap, entries: GlyphData): void {
		Object.assign(this, entries);
	},
	hasKey(this: GlyphStringMap, key: string): boolean {
		return Object.prototype.hasOwnProperty.call(this, key);
	},
	hasValue(this: GlyphStringMap, value: string): boolean {
		return Object.values(this).includes(value);
	},
	findKey(this: GlyphStringMap, value: string): string | undefined {
		return Object.entries(this).find(([, v]) => v === value)?.[0];
	},
	find(this: GlyphStringMap, ...keys: (keyof GlyphStringMap)[]): string[] | undefined {
		const result = keys.map((k) => this[k]).filter((v): v is string => v !== undefined);

		return result.length ? result : undefined;
	},
};
