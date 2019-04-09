var path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const CleanWebPackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'index.html'),
    env: process.env.NODE_ENV
  })
]

if (!devMode) {
  plugins.push(
    new CopyWebpackPlugin([{ from: 'public/', to: '.' }]),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
  )
}

if (!devMode && !process.env.GITHUB_SHA) {
  // don't ask me why, but this runs _AFTER_ the build in ci, no matter where it is in the plugin stack 🤷‍♂
  // so, we only do this if we're aren't in a github action container... 🙈
  plugins.push(new CleanWebPackPlugin(['build'], {
    root: path.resolve(__dirname),
    verbose: true
  }))
}

module.exports = {
  mode: devMode ? 'development' : 'production',
  plugins,
  entry: {
    app: ['./src/index.tsx']
  },
  optimization: {
    // minimize: !devMode
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.[hash].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: './public'
  }
}
