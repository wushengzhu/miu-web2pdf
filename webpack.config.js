const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'miu-web2pdf.js',
    // filename:'[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Html2PDF',
    libraryTarget: 'umd',
    libraryExport: 'default', // 显式导出默认内容
    globalObject: 'this',
    clean: true  // 每次构建前清空输出目录
  },
  externals:['html2canvas','jspdf'], // 依赖不打包到bundle中
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  performance: {
    hints: 'warning', // 或者设置为 'error' 或 false,控制limit的最大存储警告
    maxEntrypointSize: 1024 * 1024, // 设置为 1 MiB
    maxAssetSize: 1024 * 1024 // 设置为 1 MiB
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,  // 禁用 LICENSE 文件 打包
        terserOptions: {
          format: {
            comments: false      // 移除所有注释
          }
        }
      })
    ],
    splitChunks: false,  // 关闭代码分割
    runtimeChunk: false  // 关闭运行时文件
  }
};