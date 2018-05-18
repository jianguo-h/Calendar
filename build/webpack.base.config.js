const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//npm i --save-dev webpack-contrib/html-webpack-plugin
module.exports = {
	entry: {
		app: './src/js/calendar.js'
	},
	output: {
		filename: 'js/calendar.min.js',
		path: path.resolve(__dirname, '../dist')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			}
		]
	},
	resolve: {
		extensions: ['.js', '.json']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			inject: true
		})
	]
}