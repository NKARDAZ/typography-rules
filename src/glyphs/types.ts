export type GlyphStringMap = Record<string, string>;

export type GlyphData = Record<string, string>;

export type GlyphSet<T extends GlyphData = GlyphData> = {
	[K in keyof T]: T[K];
} & {
	join(joiner?: string): string;
};

export interface GlyphSetInterface {
	[key: string]: string | ((joiner?: string) => string);
	join(joiner?: string): string;
}

export interface ProtoSet<T extends { common?: Record<string, GlyphSetInterface> }> {
	get<TDataSet extends Exclude<keyof T, 'common'>, TKey extends keyof (T['common'] & T[TDataSet])>(
		this: T & ProtoSet<T>,
		dataSet: TDataSet,
		key: TKey
	): GlyphSetInterface;
}
