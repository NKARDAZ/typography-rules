import { proto } from './proto';
import type { GlyphData, GlyphSet, GlyphSetInterface, ProtoSet } from './types';

export type * from './types';
export * from './registry';

/**
 * Creates a glyph set with prototype utilities attached.
 *
 * This function wraps a plain glyph dictionary and attaches shared
 * prototype methods (e.g. `join`) without modifying the original data.
 *
 * Used as the base building block for all character registries.
 *
 * @template T - Glyph dictionary shape
 * @param data - Raw glyph key-value map
 * @returns A glyph set with prototype methods enabled
 */
export function createCharacters<T extends GlyphData>(data: T): GlyphSet<T> {
	return Object.assign(Object.create(proto), data) as GlyphSet<T>;
}

/**
 * Creates a prototype set for grouped glyph access.
 *
 * Provides a `get` method that merges:
 * - shared `common` glyphs
 * - locale-specific glyph overrides
 *
 * This enables hierarchical glyph resolution:
 * common → locale → final glyph set
 *
 * @template T - Structure containing optional `common` and locale groups
 * @returns Prototype object with grouped access logic
 */
export function createProtoSet<
	T extends { common?: Record<string, GlyphSetInterface> },
>(): ProtoSet<T> {
	return {
		get(dataSet, key) {
			const commonEntry = (this.common as Record<string, object>)?.[key as string] ?? {};
			const localeEntry = (this[dataSet] as Record<string, object>)?.[key as string] ?? {};

			return createCharacters({ ...commonEntry, ...localeEntry } as GlyphData);
		},
		getList(this: T & ProtoSet<T>): (keyof T & string)[] {
			return Object.keys(this) as (keyof T & string)[];
		},
		hasKey(this: T & ProtoSet<T>, key: keyof T & string): boolean {
			return this.getList().includes(key);
		},
	};
}

/**
 * Creates a full character registry with grouped access support.
 *
 * Combines:
 * - raw character data groups (e.g. common, en, ru, fr)
 * - prototype-based access layer
 * - hierarchical resolution via ProtoSet
 *
 * This is the main entry point for building locale-aware
 * glyph/typography registries.
 *
 * @template T - Character set structure with optional `common` group
 * and locale-specific groups
 *
 * @param data - Structured glyph registry
 * @returns Character set with grouped access methods
 */
export function createCharacterSet<
	T extends { common?: Record<string, GlyphSetInterface> } & Record<
		string,
		Record<string, GlyphSetInterface>
	>,
>(data: T) {
	return Object.assign(Object.create(createProtoSet<T>()), data) as T & ProtoSet<T>;
}
