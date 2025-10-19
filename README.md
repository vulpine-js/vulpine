# Formatting and linting

This repository includes Prettier and ESLint to keep code consistent.

Useful commands (run from repository root):

- Format all TypeScript sources:

  npm run format

- Run ESLint across the repo:

  npm run lint

- Run ESLint autofix:

  npm run lint:fix

Pre-commit hooks are enabled via Husky and lint-staged (run `npm install` then `npm run prepare`).
