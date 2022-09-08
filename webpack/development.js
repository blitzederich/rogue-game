// Copyright 2022 Alexander Samorodov <blitzerich@gmail.com>

const path = require('path');

const development = {
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
				],
			},
		],
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
		port: 8080,
		open: true,
		host: '0.0.0.0',
		historyApiFallback: true,
	},
};

module.exports = development;