module.exports = {
  env: { node: true },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    // allow `any` in this codebase for flexibility; change to 'warn' to surface gradually
    '@typescript-eslint/no-explicit-any': 'warn',
    // allow declarations inside case blocks (codebase uses them)
    'no-case-declarations': 'off',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
