import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

const pages = {
  index: 'Home',
  about: 'About'
}

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const productionPlugins = [
  new UglifyJSPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.CommonsChunkPlugin(
    {
      names: ['index', 'about', 'vendor'],
      chunks: ['index', 'about'],
      minChunks: Infinity
    }
  ),
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
]

export default {
  devtool: isDev && 'source-map' || false,

  entry: {
    index: './src/scripts/index.js',
    about: './src/scripts/about.js',
    vendor: ['jquery']
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/[name].js',
    publicPath: '/'
  },

  plugins: Object.keys(pages).map((id) =>
    new HtmlPlugin({
      chunks: ['vendor', id],
      template: `src/${id}.html`,
      filename: `${id}.html`,
      title: pages[id],
      favicon: './src/images/favicon.ico'
    })
  ).concat([
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new ExtractTextPlugin({
      filename: 'css/style.[contenthash:4].css',
      allChunks: true
    })
  ]).concat(isProd ? productionPlugins : []),

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
                minimize: isProd
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              publicPath: '../',
              name: `${isDev ? '' : 'fonts/'}fnt-[hash:3].[ext]`
            }
          }
        ]
      },
      {
        test: /\.(svg|jpe?g|png)$/,
        use: [
          'file?name=img/[name].[ext]'
        ].concat(isProd ? ['image-webpack'] : [])
      }
    ]
  }
}
