module.exports = {
  testMatch: ['<rootDir>/src/**/*.test.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.[tj]sx?$': '<rootDir>/jest.transformer.js',
  },
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
};