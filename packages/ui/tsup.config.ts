import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    compilerOptions: {
      declaration: true,
      declarationMap: true,
    },
  },
  tsconfig: "tsconfig.build.json",
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "lexical",
    "@lexical/react",
    "@lexical/rich-text",
    "@lexical/list",
    "@lexical/link",
    "@lexical/code",
    "@lexical/markdown",
    "@lexical/html",
    "@lexical/selection",
    "@lexical/utils",
  ],
  banner: {
    js: "'use client';",
  },
});
