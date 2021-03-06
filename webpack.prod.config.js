const path = require('path')
const glob = require('glob')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

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
const { entry, HtmlWebpackPlugins } = setMAP()

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包输出的地址，绝对路径
    filename: '[name]_[chunkhash:8].js' // name为占位符
  },
  mode: 'production',
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
        // use: ['style-loader', 'css-loader']
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // 解析less文件
      {
        test: /\.less$/,
        // use: ['style-loader', 'css-loader', 'less-loader']
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 version', '>1%'],
                }),
              ],
            },
          },
          'less-loader',
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75,
              remPrecision: 8
            }
          }
        ]
      },
      // 使用file-loader或者url-loader解析图片、字体等
      {
        test: /\.(png|jp(e?)g|gif)$/,
        // use: 'file-loader'
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name]_[hash:8].[ext]',
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
              name: 'fonts/[name]_[hash:8].[ext]',
              limit: 1024 * 10, //字体小于10KB会编码成base64格式的文件
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 清空打包dist下的所有文件
    new CleanWebpackPlugin(),
    // 提取css文件为单独文件
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    // 压缩css文件
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new FriendlyErrorsWebpackPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: {
    //         path: 'https://unpkg.com/react@16/umd/react.production.min.js',
    //       },
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: {
    //         path: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
    //       },
    //       global: 'ReactDOM',
    //     },
    //   ],
    // })
    // 主动捕获并处理构建错误
    function () {
      this.hooks.done.tap('done', (stats) => {
        if ((stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1)) {
          console.log('builderror'); process.exit(1);
        }
      })
    }
  ].concat(HtmlWebpackPlugins),
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/, //匹配出需要分离的包
          name: 'vendors',
          chunks: 'all', //async异步引⼊的库进⾏分离(默认)
        }
      }
    }
  },
  stats: 'errors-only'
}