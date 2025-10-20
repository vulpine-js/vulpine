module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2024: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    // Enable type-aware linting for packages that need it. Point to package tsconfigs.
    // Use absolute paths relative to this config file via tsconfigRootDir.
    tsconfigRootDir: __dirname,
    project: [
      './projects/core/tsconfig.cjs.json',
      './projects/core/tsconfig.esm.json',
    ],
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Show Prettier integration issues as errors in the editor
    'prettier/prettier': 'error',
    // Allow gradual migration away from `any`
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // allow devs to use console in framework code
    'no-console': 'off',
  },
  ignorePatterns: ['node_modules', 'dist'],
};
