var debug = process.env.NODE_ENV !== "production";
//var debug = false;
var webpack = require('webpack');
var path = require('path');
//var _ = require('lodash');
var moment = require('moment');

module.exports = {
  context: path.join(__dirname, "build"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/source.js",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: ['babel-loader'],
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        include: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  },
  output: {
    path: __dirname + "/build/",
    filename: "source.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ]
};
