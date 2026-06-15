import { defineConfig } from "tsup";

export default defineConfig([
  // Main package with 'use client' for React components
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: {
      resolve: true,
      // Handle complex database types by treating them as external
      respectExternal: true,
    },
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "@supabase/supabase-js", "@supabase/ssr", "@novansa/database"],
    banner: {
      js: "'use client';",
    },
  },
  // Server-only utilities without 'use client'
  {
    entry: ["src/server.ts"],
    format: ["cjs", "esm"],
    dts: {
      resolve: true,
      respectExternal: true,
    },
    splitting: false,
    sourcemap: true,
    clean: false,
    external: ["react", "react-dom", "@supabase/supabase-js", "@supabase/ssr", "@novansa/database"],
  },
]);
