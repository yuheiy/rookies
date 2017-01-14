const path = require('path')
const webpack = require('webpack')
const config = require('./config.json')

const isRelease = process.argv.includes('--release')

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.join(__dirname, 'dist', config.root, 'js'),
    publicPath: path.join(config.root, 'js/'),
    filename: 'ryden.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isRelease ? 'production' : 'development'),
    }),
    ...(isRelease ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: true,
        mangle: true,
      }),
    ] : []),
  ],
  devtool: !isRelease && 'source-map',
}
