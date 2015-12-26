var webpack = require('webpack'),
    config = require('./');

module.exports = {
    context: config.vendorBundleDir,
    plugins: process.env.NODE_ENV !== 'production' ? [] :  [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        minimize: true,
        output: {
          comments: false
        }})
    ],
    entry: './vendor.js',
    output: {
      path: config.destDirectory,
      filename: 'vendor.js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  };
