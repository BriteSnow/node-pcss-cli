export { }; // to make this file a module
import { execa } from 'execa';

const prefixer = (await import('autoprefixer')).default;
const nested = (await import('postcss-nested')).default;

const plugins = [
	nested,
	prefixer,
];


// execa base options
const { stdout, stderr } = process;
const execaOpts = Object.freeze({ stdout, stderr });


// TS_NODE_FILES=true ./node_modules/.bin/ts-node --project scripts/tsconfig.json 

describe('bin', async function () {


	it('bin-simple', async function () {
		this.timeout(5000);

		const confFile = 'tests/data/bin/simple/pcss.config.js';

		// TS_NODE_PROJECT="./tsconfig.json" node --loader ts-node/esm src/bin-pcss.ts -c test/data/bin/simple/pcss.config.js
		await execa('node', ['--loader', 'ts-node/esm', 'src/bin-pcss.ts', '-c', confFile], {
			...execaOpts,
			env: {
				TS_NODE_PROJECT: "tests/tsconfig.json"
			}
		});

	});


});