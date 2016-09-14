const webpack = require('webpack');
const helpers = require('./helpers');
const autoprefixer = require('autoprefixer');
var path = require('path');

/*
 * Webpack Plugins
 */

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

/*
 * Webpack Constants
 */
const METADATA = {
  title: 'Climate Lab',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};

module.exports = {

  metadata: METADATA,
  entry: {
    'polyfills': './src/polyfills.browser.ts',
    'vendor':    './src/vendor.browser.ts',
    'main':      './src/main.browser.ts'
  },

  resolve: {
    extensions: ['', '.ts', '.js', '.json'],
    root: helpers.root('src'),
    modulesDirectories: ['node_modules'],
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular'),
          helpers.root('node_modules/@ngrx'),
          helpers.root('node_modules/@angular2-material'),
        ]
      }
    ],

    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(css|scss)$/,
        loaders: ['style', 'css', 'postcss', 'sass']
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [helpers.root('src/index.html')]
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)/,
        loader: 'file-loader'
      }
    ]
  },

  plugins: [
    new ForkCheckerPlugin(),

    new CleanWebpackPlugin(['dist'], {
        root: helpers.root()
    }),

    new webpack.optimize.OccurenceOrderPlugin(true),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency'
    }),

    new ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      "Tether": 'tether',
      "window.Tether": "tether"
    })
  ],
  postcss: () => [autoprefixer()],

  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

};
