const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './source/index.js',
  output: {
    filename: 'build.js',
    library: 'home',
  },
  watch: NODE_ENV === 'development',
  watchOptions: {
    aggregateTimeout: 100,
  },
  devtool: NODE_ENV === 'development' ? 'source-map' : null,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
