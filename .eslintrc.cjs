module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  },
  env: {
    node: true
  },
  overrides: [
    {
      files: ['src/**/*'],
      excludedFiles: ['src/**/*.spec.tsx', 'src/**/*.spec.ts', 'src/**/*.test.tsx', 'src/**/*.test.ts'],
      rules: {
        'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
        'max-depth': ['error', 2],
        'max-params': ['error', 3],
        'max-statements-per-line': ['error', { max: 1 }],
        'max-nested-callbacks': ['error', 3]
      }
    }
  ]
};
