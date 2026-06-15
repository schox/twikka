// Theme object for RippleBase app
// Imports design tokens from constants.ts and sets up a base theme structure
// Supports light and dark mode (future-proofed for multiple themes)

import {
  COLORS,
  SPACING,
  BREAKPOINTS,
  BORDER_RADIUS,
  Z_INDEX,
  LAYOUT_BREAKPOINTS,
  AVATAR,
  PROGRESS_INDICATOR,
  DIALOG,
  BUTTON,
} from './constants';

export interface Typography {
  fontFamily: string;
  displayLarge: React.CSSProperties;
  displayMedium: React.CSSProperties;
  displaySmall: React.CSSProperties;
  headlineLarge: React.CSSProperties;
  headlineMedium: React.CSSProperties;
  headlineSmall: React.CSSProperties;
  titleLarge: React.CSSProperties;
  titleMedium: React.CSSProperties;
  titleSmall: React.CSSProperties;
  // Add more as needed
}

export interface Theme {
  colors: typeof COLORS;
  spacing: typeof SPACING;
  breakpoints: typeof BREAKPOINTS;
  borderRadius: typeof BORDER_RADIUS;
  zIndex: typeof Z_INDEX;
  layoutBreakpoints: typeof LAYOUT_BREAKPOINTS;
  avatar: typeof AVATAR;
  progressIndicator: typeof PROGRESS_INDICATOR;
  dialog: typeof DIALOG;
  button: typeof BUTTON;
  typography: Typography;
  mode: 'light' | 'dark';
}

const baseTypography: Typography = {
  fontFamily: 'Nunito, sans-serif',
  displayLarge: { fontFamily: 'Nunito, sans-serif', fontSize: 57, fontWeight: 900 },
  displayMedium: { fontFamily: 'Nunito, sans-serif', fontSize: 45, fontWeight: 800 },
  displaySmall: { fontFamily: 'Nunito, sans-serif', fontSize: 36, fontWeight: 700 },
  headlineLarge: { fontFamily: 'Nunito, sans-serif', fontSize: 32, fontWeight: 700 },
  headlineMedium: { fontFamily: 'Nunito, sans-serif', fontSize: 28, fontWeight: 600 },
  headlineSmall: { fontFamily: 'Nunito, sans-serif', fontSize: 24, fontWeight: 600 },
  titleLarge: { fontFamily: 'Nunito, sans-serif', fontSize: 32, fontWeight: 700 },
  titleMedium: { fontFamily: 'Nunito, sans-serif', fontSize: 22, fontWeight: 700 },
  titleSmall: { fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 700 },
};

export const lightTheme: Theme = {
  colors: COLORS,
  spacing: SPACING,
  breakpoints: BREAKPOINTS,
  borderRadius: BORDER_RADIUS,
  zIndex: Z_INDEX,
  layoutBreakpoints: LAYOUT_BREAKPOINTS,
  avatar: AVATAR,
  progressIndicator: PROGRESS_INDICATOR,
  dialog: DIALOG,
  button: BUTTON,
  typography: baseTypography,
  mode: 'light',
};

// Placeholder for dark theme (to be implemented)
// export const darkTheme: Theme = { ... };

// Default export for now (light theme)
export const theme = lightTheme;
