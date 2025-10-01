export default {
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: ['service/**/*.js', 'server/**/*.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/testHelpers/*',
    '<rootDir>/__tests__',
  ],
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  transform: {},
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
  setupFilesAfterEnv: ['<rootDir>/.jest/globalSetup.js'],
};

