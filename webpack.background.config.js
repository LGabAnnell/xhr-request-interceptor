const path = require('path')
module.exports = {
  mode: 'production',
  entry: './background.ts',
  output: {
    filename: 'background.js',
    path: path.resolve('./build')
  },
  module: {
    rules: [
      { test: /.*.ts$/, loader: 'ts-loader', options: { configFile: './tsconfig.background.json' } }
    ]
  }
}