import webpack from 'webpack';
import path from 'path';

export default {
  resolve: {
    root: path.join(__dirname, 'bower_components'),
    extensions: ['', '.js', '.jsx', '.css', '.scss'],
    alias: {
      // commom
      commomUtils: path.join(__dirname, '../app/utils'),
      static: path.join(__dirname, '../app/static'),
      app: path.join(__dirname, '../apps'),

      // client
      client: path.join(__dirname, '../app/client'),
      common: path.join(__dirname, '../app/client/common'),
      modules: path.join(__dirname, '../app/client/modules'),
      framework: path.join(__dirname, '../app/client/modules/framework'),
      example: path.join(__dirname, '../app/client/modules/example'),
      utils: path.join(__dirname, '../app/client/utils'),

      // server
      server: path.join(__dirname, '../app/server'),
      api: path.join(__dirname, '../app/server/api')
    }
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=2&localIdentName=[local]!autoprefixer-loader'
      }, {
        test: /\.(sass|scss)$/,
        loader: 'style-loader!css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]!autoprefixer-loader!sass-loader',
        exclude: [path.join(__dirname, '../app/client/common/style')]
      }, {
        test: /\.(sass|scss)$/,
        loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader',
        include: [path.join(__dirname, '../app/client/common/style')]
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
      }, {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=8192&name=resource/img/[hash].[ext]'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&name=resource/font/[hash].[ext]&minetype=application/font-woff'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=resource/font/[hash].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    // 打包公共库
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   filename: 'vendor.js'
    // }),
    // bower 文件
    // new webpack.ResolverPlugin(
    //   new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    // ),
    // 全局变量
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      React: 'react',
      ReactDOM: 'react-dom',
      cx: 'classname',
      config: path.join(__dirname, './config')
    })
  // css 文件单独打包
  // new ExtractTextPlugin('style.css', {
  //     allChunks: true
  // }),
  ]
};
