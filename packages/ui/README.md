# @novansa/ui

Shared UI component library for Novansa Apps monorepo.

## Installation

```bash
npm install @novansa/ui
```

## Usage

```tsx
import { Button, Card, CardContent, Input, Label } from '@novansa/ui';

function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Components

- **Button** - Flexible button component with multiple variants
- **Card** - Container component with header, content, and footer
- **Input** - Form input component with consistent styling
- **Label** - Form label component

## Development

```bash
# Build the package
npm run build

# Watch for changes during development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## CSS Variables

This package uses CSS variables for theming. Ensure your consuming application defines the following CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other theme variables */
}
```

See the Tailwind configuration in consuming apps for complete variable definitions.