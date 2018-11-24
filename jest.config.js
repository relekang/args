/* eslint-env node */
module.exports = {
  // roots: ['<rootDir>/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/test/.*(\\.|/)(tests?|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: { 'ts-jest': { diagnostics: false } },
  moduleNameMapper: {
    '\\.(css|less|sass)$': 'identity-obj-proxy',
  },
};
