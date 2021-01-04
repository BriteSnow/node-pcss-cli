import * as Path from 'path';
import { processConfigEntry } from '../../src';

const plugins = [
	require("postcss-nested"),
	require("autoprefixer"),
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