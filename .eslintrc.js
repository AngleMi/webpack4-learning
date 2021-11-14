module.exports = {
  parser: 'babel-eslint', // 指定一个解析器
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    semi: 'error',
    indent: [2, 4],
  },
}