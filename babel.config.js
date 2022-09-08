// Copyright 2022 Alexander Samorodov <blitzerich@gmail.com>

module.exports = {
	presets: [
		['@babel/preset-env', {
			"useBuiltIns": "entry",
			"corejs": "3.22"
		}],
		'@babel/preset-typescript'
	],
};