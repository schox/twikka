/**
 * @novansa/config
 *
 * Shared configuration package for ESLint, Prettier, and TypeScript
 * across all Novansa Apps.
 *
 * Usage:
 *
 * ESLint:
 * ```js
 * import { novansaEslintConfig } from '@novansa/config/eslint';
 * export default novansaEslintConfig;
 * ```
 *
 * Prettier:
 * ```js
 * module.exports = require('@novansa/config/prettier');
 * ```
 *
 * TypeScript:
 * ```json
 * {
 *   "extends": "@novansa/config/typescript/base.json"
 * }
 * ```
 */

export * from '../eslint/index.mjs';
export * from '../eslint/package.mjs';

// Re-export types and utilities if needed
export type NovansaConfig = {
  eslint: typeof import('../eslint/index.mjs');
  eslintPackage: typeof import('../eslint/package.mjs');
  prettier: typeof import('../prettier/index.js');
};
