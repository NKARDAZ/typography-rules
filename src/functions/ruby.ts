import type { Node } from '@/types';

export function rubyText(text: string): Node[] {
	return [
		{
			type: 'text',
			value: text,
		},
	];
}
