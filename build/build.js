const path = require('path');
const rimraf = require('rimraf');
const webpack = require('webpack');
const webpackProdConfig = require('./webpack.prod.config');

const buildPath = path.resolve(__dirname, '../dist');
rimraf(buildPath, err => {
  if(err) throw new Error(err);
  webpack(webpackProdConfig, (err, stats) => {
  	if(err || stats.hasErrors()) {
  		throw new Error(err);
  	}
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }));
  	console.log('\n Build complete');
  });
});