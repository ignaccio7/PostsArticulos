module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'semi': ['error', 'never'],
    'camelcase': 'off',
    'quotes': ['error', 'single'],
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'no-throw-literal': 'off',
    'multiline-ternary': 'off'
  }
}
