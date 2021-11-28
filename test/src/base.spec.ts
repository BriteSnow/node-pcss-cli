import * as Path from 'path';
import { processConfigEntry } from '../../src/index.js';

const prefixer = (await import('autoprefixer')).default;
const nested = (await import('postcss-nested')).default;

const plugins = [
	nested,
	prefixer,
];


describe('base', async function () {


	it('base-simple', async function () {
		const outDir = 'test/data/base/.out/';

		await processConfigEntry({
			input: 'test/data/base/main.pcss',
			output: Path.join(outDir, 'all.css'),
			plugins
		});

	});


});