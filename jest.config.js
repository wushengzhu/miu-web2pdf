module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'] // 让 Jest 在运行测试之前加载 jest.setup.js 文件
  };