import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // We use tsc for declarations
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom', '@supabase/supabase-js'],
  jsx: 'automatic',
});