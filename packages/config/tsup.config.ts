import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // We use tsc for declarations
  clean: true,
  sourcemap: true,
  external: ['@eslint/eslintrc', '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'],
});