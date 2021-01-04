import execa from 'execa';

const plugins = [
	require("postcss-nested"),
	require("autoprefixer"),
];


// execa base options
const { stdout, stderr } = process;
const execaOpts = Object.freeze({ stdout, stderr });


// TS_NODE_FILES=true ./node_modules/.bin/ts-node --project scripts/tsconfig.json 

describe('bin', async function () {


	it('bin-simple', async function () {
		const confFile = 'test/data/bin/simple/pcss.config.js';

		// ./node_modules/.bin/ts-node src/bin-pcss.ts -c test/data/bin/simple/pcss.config.js -w
		await execa('./node_modules/.bin/ts-node', ['src/bin-pcss.ts', '-c', confFile], {
			...execaOpts,
			env: {
				TS_NODE_FILES: 'true'
			}
		});

	});


});