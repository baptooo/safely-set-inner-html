const path = require('path');

module.exports = (env, argv) => ({
  entry: {
    safelySetInnerHTML: path.join(__dirname, 'src/safelySetInnerHTML.js')
  },
  output: {
    filename: `[name]${argv.mode === 'production' ? '.min' : ''}.js`,
    library: 'safelySetInnerHTML',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  externals: {
    react: 'react',
    himalaya: 'himalaya'
  }
});
