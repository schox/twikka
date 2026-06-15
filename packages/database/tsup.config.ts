import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true, // Let tsup handle declarations
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [],
});
