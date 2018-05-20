const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    // 提取css
    new MiniCssExtractPlugin({
      filename: 'css/calendar.min.css'
    }),
    // 压缩css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true
    }),
    // 压缩混淆js
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        compress: {
          drop_console: true,   // 去除日志
          drop_debugger: true   // 去除debugger
        }
      },
      parallel: true
    })
  ]
});

module.exports = webpackProdConfig;