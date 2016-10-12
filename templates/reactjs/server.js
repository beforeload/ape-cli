/*eslint no-console:0 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');
var open = require('open');

new WebpackDevServer(webpack(config), {
  historyApiFallback: true,
  hot: true,
  publicPath: config.output.publicPath,
  // headers: {
  //     'Access-Control-Allow-Origin': '*'
  // },
  quiet: true,
  stats: {
      colors: true
  }
  // proxy: {
  //   '**/api/**': {
  //     target: 'http://api.domain',
  //     secure: false,
  //     changeOrigin: true
  //   }
  // }
})
.listen(config.port, 'localhost', function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
  open('http://localhost:' + config.port + '/');
});
