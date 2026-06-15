"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  novansaEslintConfig: () => novansaEslintConfig,
  novansaPackageEslintConfig: () => novansaPackageEslintConfig
});
module.exports = __toCommonJS(index_exports);

// eslint/index.mjs
var import_eslintrc = require("@eslint/eslintrc");
var import_eslint_plugin = __toESM(require("@typescript-eslint/eslint-plugin"), 1);
var import_parser = __toESM(require("@typescript-eslint/parser"), 1);
var compat = new import_eslintrc.FlatCompat({
  baseDirectory: process.cwd()
});
var novansaEslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": import_eslint_plugin.default },
    languageOptions: {
      parser: import_parser.default,
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
var import_path = require("path");
var import_url = require("url");
var import_eslintrc2 = require("@eslint/eslintrc");
var import_eslint_plugin2 = __toESM(require("@typescript-eslint/eslint-plugin"), 1);
var import_parser2 = __toESM(require("@typescript-eslint/parser"), 1);
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = (0, import_path.dirname)(__filename);
var compat2 = new import_eslintrc2.FlatCompat({
  baseDirectory: __dirname
});
var novansaPackageEslintConfig = [
  {
    ignores: ["dist/**", "node_modules/**", "*.d.ts"]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": import_eslint_plugin2.default },
    languageOptions: {
      parser: import_parser2.default,
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
      parser: import_parser2.default,
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  novansaEslintConfig,
  novansaPackageEslintConfig
});
//# sourceMappingURL=index.js.map