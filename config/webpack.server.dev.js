import webpack from 'webpack';

import path from 'path';
import config from './config';
import fs from 'fs';

const otherPkg = [
  "sails/node_modules/rc"
]

export default {
  entry: {
    server: [
      './app/server/app.js'
    ]
  },
  output: {
    path: path.join(__dirname, '../build/'),
    filename: '[name].js',
  },
  externals: nodeModule(otherPkg),
  target: 'node',
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [path.join(__dirname, './app/server')],
        exclude: [path.join(__dirname, './node_modules'), path.join(__dirname, './app/server/node_modules')]
      },{
        test: /\.json$/,
        loaders: ['json'],
        include: [path.join(__dirname, './app/server')]
      },
    ]
  },
  // devtool: 'source-map',
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   comments: false
    // })
  ]
};

function nodeModule(packages){
  const nodeModules = {};
  fs.readdirSync('node_modules')
    .filter(function(x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .concat(packages)
    .forEach(mod => {
      nodeModules[mod] = 'commonjs ' + mod;
    });
  return nodeModules;
}