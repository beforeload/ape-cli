var webpack = require('webpack');
var path = require('path');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require('./package.json');

module.exports = {
  entry: './src/app',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle_[hash].js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.title,
      template: 'tpl/index.html', // Load a custom template
      inject: 'body' // Inject all scripts into the body
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: ['babel?presets[]=react,presets[]=es2015'],
      // loaders: ['babel?presets[]=react,presets[]=es2015'],
      include: path.join(__dirname, '/src/')
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.less/,
      loader: 'style!css!less!postcss'
    }, {
      test: /\.(png|jpg|gif|woff|woff2)$/,
      loader: 'url-loader?limit=8192'
    }]
  },
  postcss: function() {
    return [precss, autoprefixer];
  }
}
