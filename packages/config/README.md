# @novansa/config

Shared configuration package for ESLint, Prettier, and TypeScript across all Novansa Apps.

## Installation

This package is automatically included in the monorepo workspace. For external projects:

```bash
npm install @novansa/config
```

## Usage

### ESLint Configuration

Create or update your `eslint.config.mjs`:

```js
import { novansaEslintConfig } from '@novansa/config/eslint';

export default novansaEslintConfig;
```

### Prettier Configuration

Create or update your `.prettierrc.js`:

```js
module.exports = require('@novansa/config/prettier');
```

Or for JSON format (`.prettierrc`):

```json
"@novansa/config/prettier"
```

### TypeScript Configuration

Update your `tsconfig.json`:

```json
{
  "extends": "@novansa/config/typescript/base.json",
  "compilerOptions": {
    // App-specific overrides here
  }
}
```

## Features

### ESLint
- Next.js and TypeScript optimized
- Strict type checking rules
- Consistent code quality standards
- No unsafe operations allowed

### Prettier
- Consistent formatting across all apps
- Single quotes, semicolons, trailing commas
- 100 character line width
- 2-space indentation

### TypeScript
- Strict mode enabled
- Additional safety checks
- Shared path aliases
- Optimized for monorepo structure

## Customization

While this package provides sensible defaults, apps can extend or override rules as needed:

```js
// eslint.config.mjs
import { novansaEslintConfig } from '@novansa/config/eslint';

export default [
  ...novansaEslintConfig,
  {
    // App-specific overrides
    rules: {
      // Override specific rules if needed
    }
  }
];
```

## Maintenance

When updating configurations:

1. Update the relevant file in this package
2. Rebuild the package: `npm run build`
3. Test across all apps
4. Version bump if needed

## Contributing

Please ensure any changes to the configuration are:
- Discussed with the team
- Tested across all applications
- Documented in this README
- Backward compatible when possible