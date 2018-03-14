const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

const webpackDevConfig = webpackMerge(webpackBaseConfig, {
	mode: 'development',
	devtool: '#cheap-module-eval-source-map',
	output: {
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
			}
		]
	},
	plugins: [
		// new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
});

module.exports = webpackDevConfig;