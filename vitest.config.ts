import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^@\/(.*)$/,
				replacement: resolve(__dirname, 'src/$1'),
			},
		],
	},
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 70,
				statements: 80,
			},
		},
	},
});
