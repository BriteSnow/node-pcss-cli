const plugins = [
	require("autoprefixer"),
	require("postcss-import"),
	require("postcss-mixins"),
	require("postcss-nested")
];

module.exports = {
	// required. Support single string, or array, will be processed in order
	input: ['./pcss/**/*.pcss'],

	// required. single css file supported for now. 
	output: './.out/all-bundle.css',

	// postcss processor arrays
	plugins
}
