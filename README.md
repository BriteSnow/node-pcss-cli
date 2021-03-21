## Intro

This is a config driven (i.e., `pcss.config.js`) post css cli similar to `rollup.config.js`. 

The [official postcss-cli](https://www.npmjs.com/package/postcss-cli) takes a more command line driven approach, which is fine, but might not be suitable for some build workflows. 

## Usage

- Default to `pcss.config.js`
- `-c` to specify custom config file. All input/output path will be relative to the targeted config file. 
- `-w` to specify watch mode. 


```sh
# peer dependency, must be installed
npm install -D postcss 

# Install the pcss-cli
npm install -D pcss-cli

# Install any postcss plugins (for example)
npm install postcss-import postcss-mixins postcss-nested
```

Create a **pcss.config.js**



```js
const plugins = [
	require("autoprefixer"),
	require("postcss-import"),
	require("postcss-mixins"),
	require("postcss-nested")
];

// NOTE: Paths are relative to the pcss.config.js, not to cwd
module.exports = {
	// required. Support single string, or array, will be processed in order
	input: ['./pcss/main.pcss', './src/**/*.pcss'], 

	// required. single css file supported for now. 
	output: './css/all-bundle.css',

	// optional. Override the input for watch files
	watchPath: ['./pcss/**/*.pcss', './src/**/*.pcss'],

	// postcss processor arrays
	plugins
}

// Note: module.exports can return an array of the object above, for multiple processing units.
```

Run

```sh
# will use pcss.config.js
node ./node_module/.bin/pcss

# will use path/to/pcss.config.js, relative input/output path will be relative to path/to/
node ./node_module/.bin/pcss -c path/to/pcss.config.js

# will do watch mode
node ./node_module/.bin/pcss -w -c path/to/pcss.config.js
```