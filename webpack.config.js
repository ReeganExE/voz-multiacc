var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    WriteFilePlugin = require("write-file-webpack-plugin");

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env;

const DEV = env.NODE_ENV === "development";

var options = {
  entry: {
    content: path.join(__dirname, "src", "content", "content_script.js"),
    background: path.join(__dirname, "src", "background.js")
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      // { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ }
    ]
  },
  plugins: [
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'background.html'),
      filename: 'background.html',
      chunks: ['background']
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "src", "manifest.json")
      },
      {
        from: path.join(__dirname, "src", "sharieye_04.png")
      }
    ])
  ].concat(DEV ? new WriteFilePlugin() : [])
};

if (DEV) {
  options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;