module.exports = {
  watch: true,  
  entry: {
    app: './src/index.js'
    },  
  output: {
    path: __dirname + '/static/network',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};