// Copyright 2022 Alexander Samorodov <blitzerich@gmail.com>

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const production = {
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css',
		}),
	],
};

module.exports = production;