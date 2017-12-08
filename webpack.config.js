const path = require('path');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';

let rules = [
  {
    test: /\.(js)$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
  }
];
let plugins = [];

if (isProd) {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin()
  ])
}

module.exports = {
  entry: {
    safelySetInnerHtml: path.join(__dirname, 'src/safelySetInnerHtml.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `[name]${isProd ? '.min' : ''}.js`,
    library: 'SafelySetInnerHtml',
    libraryTarget: 'umd',
  },
  module: {
    rules
  },
  plugins,
  externals: {
    react: 'react'
  }
};
