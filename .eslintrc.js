module.exports = {
  root: true,
  extends: ['expo', 'plugin:react-hooks/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native', 'react-hooks'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
  rules: {
    'react/react-in-jsx-scope': 'off'
  },
}
