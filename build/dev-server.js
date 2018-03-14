const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.dev.config');
const port = 8080;
const url = 'http://localhost:' + port;

// http://webpack.github.io/docs/webpack-dev-server.html
// https://juejin.im/post/59e85eebf265da430d571f89
Object.keys(webpackDevConfig.entry).forEach(entryName => {
  webpackDevConfig.entry[entryName] = ['webpack-dev-server/client?' + url, 'webpack/hot/dev-server'].concat(webpackDevConfig.entry[entryName]);
});

const compiler = webpack(webpackDevConfig);
const server = new webpackDevServer(compiler, {
  hot: true,
  stats: {
    colors: true
  }
});

server.listen(port, () => {
  console.log('> Listening at ' + url);
});