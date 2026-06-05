import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { readdirSync, statSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

import pkg from './package.json' with { type: 'json' };
const limit = pkg.bundleSizeLimit;

await rm('dist', { recursive: true, force: true });

const common = {
	bundle: true,
	treeShaking: true,
	sourcemap: true,
	metafile: true,
	platform: 'neutral',
	target: 'es2022',
	tsconfig: 'tsconfig.build.json',
};

const glyphsMJS = await build({
	...common,
	entryPoints: ['src/glyphs/index.ts'],
	format: 'esm',
	outfile: 'dist/glyphs.mjs',
});
const glyphsCJS = await build({
	...common,
	entryPoints: ['src/glyphs/index.ts'],
	format: 'cjs',
	outfile: 'dist/glyphs.cjs',
});

await writeFile('dist/glyphs-meta-esm.json', JSON.stringify(glyphsMJS.metafile));
await writeFile('dist/glyphs-meta-cjs.json', JSON.stringify(glyphsCJS.metafile));

const helpersMJS = await build({
	...common,
	entryPoints: ['src/helpers.ts'],
	format: 'esm',
	outfile: 'dist/helpers.mjs',
});
const helpersCJS = await build({
	...common,
	entryPoints: ['src/helpers.ts'],
	format: 'cjs',
	outfile: 'dist/helpers.cjs',
});

await writeFile('dist/helpers-meta-esm.json', JSON.stringify(helpersMJS.metafile));
await writeFile('dist/helpers-meta-cjs.json', JSON.stringify(helpersCJS.metafile));

const externalImportsPlugin = (format) => ({
	name: 'external-glyphs',
	setup(build) {
		build.onResolve({ filter: /.*/ }, (args) => {
			if (args.importer && args.path.includes('/glyphs')) {
				return {
					path: format === 'esm' ? './glyphs.mjs' : './glyphs.cjs',
					external: true,
				};
			}
			if (args.importer && args.path.includes('/helpers')) {
				return {
					path: format === 'esm' ? './helpers.mjs' : './helpers.cjs',
					external: true,
				};
			}
		});
	},
});

const resultMJS = await build({
	...common,
	entryPoints: ['src/index.ts'],
	format: 'esm',
	outfile: 'dist/index.mjs',
	plugins: [externalImportsPlugin('esm')],
});
const resultCJS = await build({
	...common,
	entryPoints: ['src/index.ts'],
	format: 'cjs',
	outfile: 'dist/index.cjs',
	plugins: [externalImportsPlugin('cjs')],
});

await writeFile('dist/meta-esm.json', JSON.stringify(resultMJS.metafile));
await writeFile('dist/meta-cjs.json', JSON.stringify(resultCJS.metafile));

const distFiles = readdirSync('dist').filter((f) => !f.endsWith('.map') && !f.endsWith('.json'));
const totalSize = distFiles.reduce((sum, f) => sum + statSync(`dist/${f}`).size, 0);

if (totalSize > limit) {
	console.log('\x1b[33m%s\x1b[0m', `Bundle too large: ${totalSize} > ${limit}`);
	process.exit(1);
} else {
	console.log('\x1b[32m%s\x1b[0m', `Bundle size: ${totalSize} < ${limit}`);
}
