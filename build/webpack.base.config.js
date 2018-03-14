const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//npm i --save-dev webpack-contrib/html-webpack-plugin
module.exports = {
	entry: {
		app: './src/calendar.ts'
	},
	output: {
		filename: 'js/calendar.min.js',
		path: path.resolve(__dirname, '../dist')
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: ['ts-loader']
			}
		]
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
			filename: 'index.html',
			inject: true
		})
	]
}