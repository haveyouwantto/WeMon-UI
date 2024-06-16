var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const TerserPlugin = require("terser-webpack-plugin");
const CssMinifier = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: "production",
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader',
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      cache: false,
      filename: 'index.html',
      template: 'resources/index.html',
      // favicon: 'favicon.ico',
      title: 'demo'
    }),
    new HtmlInlineScriptPlugin(),
    new HTMLInlineCSSWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: { ascii_only: true }
        }
      }),
      new CssMinifier()
    ]
  },
};