const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpackProdConfig = webpackMerge(webpackBaseConfig, {
	devtool: false,
	mode: 'production',
	output: {
		publicPath: './'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						'postcss-loader',
						'less-loader'
					]
				})
			}
		]
	},
	plugins: [
		// 提取css
		new ExtractTextPlugin({
			filename: 'css/calendar.min.css'
		}),
		// 压缩css
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.optimize\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorOptions: { 
				discardComments: {
					removeAll: true 
				} 
			},
			canPrint: true
		})
	]
});

module.exports = webpackProdConfig;