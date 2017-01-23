const helpers = require('./helpers');

const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: helpers.root('src'),
  },

  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [helpers.root('node_modules'), /\.spec\./]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
        // these packages have problems with their sourcemaps
        helpers.root('node_modules/rxjs'),
        helpers.root('node_modules/@angular')
      ]}

    ],

    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader?keepUrl=true'],
        exclude: [/\.e2e\.ts$/]
      },
      { test: /\.json$/, loader: 'json-loader', exclude: [helpers.root('src/index.html')] },
      { test: /\.css$/, loaders: ['to-string-loader', 'css-loader'], exclude: [helpers.root('src/index.html')] },
      { test: /\.html$/, loader: 'raw-loader', exclude: [helpers.root('src/index.html')] },
      { test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'raw-loader'}
    ],
    postLoaders: [
      {
        test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
        include: helpers.root('src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      }

    ]
  },

  plugins: [
    new DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'HMR': false,
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV),
        'HMR': false,
      }
    }),
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },

  node: {
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

};
