const path = require('path');
const webpack = require('webpack');

const outputDirectory = 'dist';

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: ['@babel/polyfill', './src/client/index.js'],
  output: {
    path: path.join(__dirname, outputDirectory),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    port: 9000,
    contentBase: outputDirectory,
    proxy: {
      '/graphql': 'http://localhost:3000'
    },
    hot: true,
  },
};
