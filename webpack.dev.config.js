const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')


// 动态的设置entry和html-webpack-plugin
const setMAP = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];
  // 获取各个页面的入口文件路径
  const entryFiles = glob.sync(path.resolve(__dirname, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
      const entryFile = entryFiles[index];
      // 正则匹配pageName(即/Users/tal/Desktop/my-project/src/index/index.js，src和index.js之间的值)
      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      HtmlWebpackPlugins.push(
          new HtmlWebpackPlugin({
              // 本地模板文件的位置，支持加载器(如handlebars、ejs、undersore、html等)
              template: path.resolve(__dirname, `src/${pageName}/index.html`),
              // 输出文件的文件名称，默认为index.html，不配置就是该文件名；此外，还可以为输出文件指定目录位置（例如'pages/index.html'）
              filename: `${pageName}.html`,
              // 提取的基础包名字可以不写
              chunks: ['vendors', pageName],
              inject: true,
              minify: {
                  html5: true,
                  collapseWhitespace: true,
                  preserveLineBreaks: false,
                  minifyCSS: true,
                  minifyJS: true,
                  removeComments: false,
              },
          }),
      );
  });
  return {
      entry,
      HtmlWebpackPlugins,
  };
};
const { entry, HtmlWebpackPlugins }  = setMAP()
module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包输出的地址，绝对路径
    filename: '[name].js' // name为占位符
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
              name: 'images/[name].[ext]',
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
              name: 'fonts/[name].[ext]',
              limit: 1024 * 10, //字体小于10KB会编码成base64格式的文件
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ].concat(HtmlWebpackPlugins),
  devServer: {
    contentBase: './dist',
    hot: true,
    // open: true
  },
  devtool: 'source-map'
}