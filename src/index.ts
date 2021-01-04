import { glob, mkdirs, readFile, saferRemove, writeFile } from 'fs-extra-plus';
import * as Path from 'path';
import postcss, { AcceptedPlugin } from 'postcss';



export interface ProcessConfig {
	input: string | string[];
	output: string;
	plugins?: AcceptedPlugin[];
}


export async function processConfigEntry(config: ProcessConfig) {
	const { output, plugins } = config;
	const inputFiles = await resolveGlobs(config.input);
	const mapFile = output + ".map";
	let pcssResult: any;
	try {
		const outDir = Path.dirname(output);
		await mkdirs(outDir);
		await saferRemove([output, mapFile]);

		const processor = postcss(plugins);
		const pcssNodes = [];

		// we parse all of the .pcss files
		for (let srcFile of inputFiles) {
			// read the file
			let pcss = await readFile(srcFile, "utf8");

			const pcssNode = postcss.parse(pcss, {
				from: srcFile
			});
			pcssNodes.push(pcssNode);

		}

		// build build the combined rootNode and its result
		let rootNode = null;
		for (let pcssNode of pcssNodes) {
			rootNode = (rootNode) ? rootNode.append(pcssNode) : pcssNode;
		}
		const rootNodeResult = rootNode!.toResult();

		// we process the rootNodeResult
		pcssResult = await processor.process(rootNodeResult, {
			from: "undefined",
			to: output,
			map: { inline: false }
		});
	} catch (ex) {
		console.log(`postcss ERROR - Cannot process ${output} because {ex}\n\t(setting css empty file) \n$`);
		// we write the .css and .map files
		await writeFile(output, "", "utf8");
		await writeFile(mapFile, "", "utf8");
		return;
	}

	// we write the .css and .map files
	console.log(`pcss-cli - css file generated - ${output}`);
	await writeFile(output, pcssResult.css, "utf8");
	console.log(`pcss-cli - css map  generated - ${mapFile}`);
	await writeFile(mapFile, pcssResult.map.toString(), "utf8");
}


/** Since 0.11.18 each string glob is sorted within their match, but if globs is an array, the order of each result glob result is preserved. */
async function resolveGlobs(globs: string | string[]) {
	if (typeof globs === 'string') {
		return glob(globs);
	} else {
		const lists: string[][] = [];
		for (const globStr of globs) {
			const list = await glob(globStr);
			lists.push(list);
		}
		return lists.flat();
	}

}