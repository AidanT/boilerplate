const HtmlWebpackPlugin = require('html-webpack-plugin')
const { name } = require('./package')

const create = {
  rule: (test, use, exclude = /node_modules/) => ({ test, use, exclude })
}

module.exports = (env, { mode = 'production' } = {}) => ({
  mode,
  module: {
    rules: [
      create.rule(/\.ts/, 'ts-loader'),
      create.rule(/\.(png|jpe?g|gif)/, 'file-loader'),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ title: name }),
  ],
  resolve: {
    extensions: ['.ts', '.wasm', '.mjs', '.js', '.json'],
  },
  watch: mode !== 'production',
})
