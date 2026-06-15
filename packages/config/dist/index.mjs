// eslint/index.mjs
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
var compat = new FlatCompat({
  baseDirectory: process.cwd()
});
var novansaEslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint },
    languageOptions: {
      parser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    rules: {
      // TypeScript rules - Progressive improvement strategy
      // Errors: Critical issues that should be fixed immediately
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      // Warnings: Issues to fix progressively during feature work
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      // Disabled: Too strict for progressive improvement, re-enable later
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      // React/Next.js best practices
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-target-blank": "error",
      "react/no-unescaped-entities": "warn",
      // General code quality
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error"
    }
  }
];

// eslint/package.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat as FlatCompat2 } from "@eslint/eslintrc";
import tseslint2 from "@typescript-eslint/eslint-plugin";
import parser2 from "@typescript-eslint/parser";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var compat2 = new FlatCompat2({
  baseDirectory: __dirname
});
var novansaPackageEslintConfig = [
  {
    ignores: ["dist/**", "node_modules/**", "*.d.ts"]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint2 },
    languageOptions: {
      parser: parser2,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    rules: {
      // Strict TypeScript rules for packages
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      // Package quality standards
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "error",
      // Packages shouldn't console.log
      // Disable rules that conflict with our current state
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unnecessary-condition": "off"
    }
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/test/**/*", "*.config.ts", "*.config.js", "*.config.mjs"],
    languageOptions: {
      parser: parser2,
      parserOptions: {
        // Don't require tsconfig.json for test files and config files
        project: null
      }
    },
    rules: {
      // Relax rules for test files and config files
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      // Disable rules that require type information for test files
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/consistent-type-assertions": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off"
    }
  }
];
export {
  novansaEslintConfig,
  novansaPackageEslintConfig
};
//# sourceMappingURL=index.mjs.map