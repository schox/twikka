import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Strict ESLint configuration for shared packages
 * Packages should maintain higher code quality standards
 */
export const novansaPackageEslintConfig = [
  {
    ignores: ['dist/**', 'node_modules/**', '*.d.ts'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tseslint },
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Strict TypeScript rules for packages
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      // Package quality standards
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'error', // Packages shouldn't console.log

      // Disable rules that conflict with our current state
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/test/**/*', '*.config.ts', '*.config.js', '*.config.mjs'],
    languageOptions: {
      parser,
      parserOptions: {
        // Don't require tsconfig.json for test files and config files
        project: null,
      },
    },
    rules: {
      // Relax rules for test files and config files
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      // Disable rules that require type information for test files
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
];

export default novansaPackageEslintConfig;
