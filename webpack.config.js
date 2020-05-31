const path = require('path');
module.exports = {
  entry: './static/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  node: {
    __dirname: false,
  },
  target: 'node',
  externals: [],
};

