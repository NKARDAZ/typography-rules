export interface BaseRule {
	weight?: number;
}

export type RegExpReplaceRule = BaseRule & {
	kind: 'replace';
	rule: RegExp;
	replacement: string;
};

export type RegExpTransformRule = BaseRule & {
	kind: 'transform';
	rule: RegExp;
	transform: (match: RegExpExecArray) => string;
};

export type FunctionRule<
	TArgs extends unknown[] = unknown[],
	TFn extends (text: string, ...args: TArgs) => string = (text: string, ...args: TArgs) => string,
> = BaseRule & {
	kind: 'function';
	rule: TFn;
	args?: TArgs;
};

export type RuleFunction = (text: string, ...args: never[]) => string;

export type Rule = RegExpReplaceRule | RegExpTransformRule | FunctionRule;

// Functuin’s types

export interface QuoteSettings {
	outer: [string, string];
	inner: [string, string];
}

export interface NumberSpaceSettings {
	minLength?: number;
	separateFloat?: boolean;
}

// Storage types

export type StringMap = Record<string, string>;

export type CharacterData = Record<string, string>;

export type CharacterSet<T extends CharacterData = CharacterData> = {
	[K in keyof T]: T[K];
} & {
	join(joiner?: string): string;
};

export interface AnyCharacterSet {
	[key: string]: string | ((joiner?: string) => string);
	join(joiner?: string): string;
}

export interface ProtoSet<T extends { common?: Record<string, AnyCharacterSet> }> {
	get<TDataSet extends Exclude<keyof T, 'common'>, TKey extends keyof (T['common'] & T[TDataSet])>(
		this: T & ProtoSet<T>,
		dataSet: TDataSet,
		key: TKey
	): AnyCharacterSet;
}
