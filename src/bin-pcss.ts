#!/usr/bin/env node

import * as chokidar from 'chokidar';
import { pathExists } from 'fs-aux';
import debounce from 'lodash.debounce';
import minimist, { ParsedArgs } from 'minimist';
import { pathToFileURL } from 'node:url';
import * as Path from 'path';
import { asArray, deepClone } from 'utils-min';
import { ProcessConfig, processConfigEntry } from './index.js';


const argv = minimist(process.argv.slice(2), { '--': true });

run(argv);

interface PcssConfigEntry extends ProcessConfig {
	/** If defined, override the input for the files to watch (support file path and glob, single string or array of) */
	watchPath?: string | string[]
}

async function run(argv: ParsedArgs) {
	const watchMode = argv.w ?? false;

	const confFile = argv.c ?? 'pcss.config.js';

	const entries = await parseConfFile(confFile);

	for (const entry of entries) {
		const { input, output, plugins } = entry;
		const watchPath = entry.watchPath ?? input;
		const processOpts: ProcessConfig = { input, output, plugins };
		await processConfigEntry(processOpts);

		if (watchMode) {
			const watcher = chokidar.watch(watchPath, { ignoreInitial: true, persistent: true });
			const process = debounce(async () => {
				await processConfigEntry(processOpts);
			}, 500);

			// TODO: Needs to use a call reducer
			watcher.on('change', process);
			watcher.on('add', process);
			watcher.on('remove', process);
		}
	}
}


async function parseConfFile(confFile: string): Promise<PcssConfigEntry[]> {
	const exists = await pathExists(confFile);
	if (!exists) {
		throw new Error(`ERROR - pcss-cli - Cannot find file ${confFile}`);
	}

	// resolve from pwd
	const confModulePath = Path.resolve(confFile);
	const confModulePathUrl = pathToFileURL(confModulePath).toString()
	const confFileObj = await import(confModulePathUrl);
	const confDir = Path.dirname(confModulePath);

	const confFileEntries = asArray(confFileObj.default);

	assertConfigEntries(confFileEntries);

	const entries: PcssConfigEntry[] = deepClone(confFileEntries);

	function resolveEntryPath(path: string) {
		return !Path.isAbsolute(path) ? Path.join(confDir, path) : path;
	}

	for (const entry of entries) {
		entry.output = resolveEntryPath(entry.output)
		entry.input = asArray(entry.input).map(resolveEntryPath);
		if (entry.watchPath) {
			entry.watchPath = asArray(entry.watchPath).map(resolveEntryPath);
		}
	}

	return entries;
}

function assertConfigEntries(arr: any[]): asserts arr is PcssConfigEntry[] {
	for (const obj of arr) {
		if (obj.input == null || obj.output == null) {
			throw new Error('ERROR - pcss-cli - invalid entry, each entry must have .input (string | string[]) and .output (string) properties')
		}
	}
	// TODO: more validation.
}