// Copyright 2022 Alexander Samorodov <blitzerich@gmail.com>

const path = require('path');
const merge = require('webpack-merge').merge;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[contenthash].js',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: ['babel-loader', 'ts-loader']
			},
			{
				test: /\.png$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext][query]',
				},
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './public/index.html',
		}),
	],
	resolve: {
		extensions: ['.js','.ts'],
	},
};

module.exports = isProduction
	? merge(config, require('./webpack/production'))
	: merge(config, require('./webpack/development'));