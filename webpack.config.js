const { join } = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/main.ts',
	output: {
		path: join(__dirname, 'docs'),
		filename: '[name].bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
		],
	},
	plugins: [
		new HtmlPlugin({
			template: join(__dirname, 'src/index.html'),
		}),
	],

	devServer: {
		contentBase: join(__dirname, 'build'),
		compress: true,
		port: 9000
	  }
};
