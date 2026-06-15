import { novansaPackageEslintConfig } from '@novansa/config/eslint/package';

export default [
  ...novansaPackageEslintConfig,
  {
    // Allow console statements in debug utilities, providers, and other development helpers
    files: ['**/utils/debug.ts', '**/utils/claims.ts', '**/utils/auth.ts', '**/providers/*.tsx'],
    rules: {
      'no-console': 'off',
    },
  },
];