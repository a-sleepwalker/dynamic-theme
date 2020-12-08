const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);

process.env.NODE_ENV = 'development';

const config = {
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  entry: resolve('example/index.tsx'),
  devServer: {
    port: 3000,
    hot: true,
    inline: true,
    historyApiFallback: true,
  },
  output: {
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      {parser: {requireEnsure: false}},

      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: 'babel-loader',
          },
          {
            test: /\.(styl|stylus)$/,
            loader: ['style-loader', 'css-loader', 'resolve-url-loader', 'stylus-loader'],
          },
        ],
      },
      {
        test: /\.pug$/,
        loader: ['html-loader', 'pug-html-loader'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: resolve('example/index.pug'),
    }),
  ],
};

module.exports = config;
