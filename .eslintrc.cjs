module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
  },
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    {
      files: ['src/utils/{helpers,logger,monitoring,performance}.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['src/utils/api.ts', 'src/hooks/useApi.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['playwright.config.*'],
      env: { node: true },
      rules: { 'no-undef': 'off' },
    },
    {
      files: ['src/setupTests.ts', 'src/components/__tests__/**/*.{ts,tsx}'],
      env: { jest: true, node: true, browser: true },
      rules: {
        'no-undef': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        global: 'readonly',
      },
    },
    {
      files: ['tests/**', 'playwright.config.*'],
      env: { node: true, browser: true },
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.config.*', 'vite.config.ts', 'jest.config.*', 'tailwind.config.js', 'postcss.config.js'],
      env: { node: true },
    },
    {
      files: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/__tests__/**/*.{ts,tsx}'],
      env: { jest: true, node: true, browser: true },
      rules: {
        'no-redeclare': 'off',
        'no-undef': 'off',
      },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
      },
    },
  ],
}
