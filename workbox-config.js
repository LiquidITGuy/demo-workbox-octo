module.exports = {
	globDirectory: 'src/',
	globPatterns: [
		'**/*.{js,svg,css}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};