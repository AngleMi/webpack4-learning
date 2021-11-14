const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包输出的地址，绝对路径
    filename: '[name][chunkhash:8].js' // name为占位符
  },
  mode: 'development',
  module: {
    rules: [
      // 解析js文件
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      // 解析css文件
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 解析less文件
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      // 使用file-loader或者url-loader解析图片、字体等
      {
        test: /\.(png|jp(e?)g|gif)$/,
        // use: 'file-loader'
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name][hash:8].[ext]',
              limit: 1024 * 10, //图片小于10KB会编码成base64格式的文件
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        // use: 'file-loader'
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'fonts/[name][hash:8].[ext]',
              limit: 1024 * 10, //字体小于10KB会编码成base64格式的文件
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'), // html模板
      filename: 'index.html', // 打包出来的html的文件名称
      chunks: ['index'], //
      inject: true, // js, css会自动注入到html下
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/search.html'),
      filename: 'search.html',
      chunks: ['search'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    open: true
  }
}