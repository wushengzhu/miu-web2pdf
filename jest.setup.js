// jest.setup.js
// 设置全局超时时间
jest.setTimeout(10000); // 单位为毫秒

// 引入自定义匹配器
const matchers = require('jest-extended');
expect.extend(matchers);

// 定义全局变量或工具函数
global.customFunction = () => {
  console.log('This is a custom function');
};