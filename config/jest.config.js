module.exports = {
  rootDir: '../app/scripts',
  transform: {
    '.(ts|tsx)$': 'ts-jest'
  },
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testRegex: '((\\.|/*.)(test))\\.ts?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json']
}
