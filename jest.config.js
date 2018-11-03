module.exports = {
  collectCoverageFrom: ['tsx/**/*.tsx'],
  roots: ['<rootDir>/tsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupTestFrameworkScriptFile: './test/setup.ts'
}
