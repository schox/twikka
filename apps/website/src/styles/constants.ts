// App-wide constants for RippleBase
// Use this file for UI, color, environment, and other global constants

// --- Spacing ---
export const SPACING = {
  xs: 4, // Extra Small
  sm: 8, // Small
  md: 12, // Medium
  lg: 16, // Large
  xl: 24, // Extra Large
  xxl: 32, // Double Extra Large
};

// --- Border Radius ---
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 10, // Match Flutter BORDER_RADIUS
  xl: 16, // Match Flutter BORDER_RADIUS_LARGE
  full: 9999,
};

// --- Breakpoints ---
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// --- Z-Index ---
export const Z_INDEX = {
  dropdown: 1000,
  modal: 1100,
  popover: 1200,
  tooltip: 1300,
};

// --- Color Scheme ---
export const COLORS = {
  primary: '#5F27CD',
  'on-primary': '#FFFFFF',
  'primary-container': '#E3DFFF',
  'on-primary-container': '#2D1E5F',
  secondary: '#FFA000',
  'on-secondary': '#3A2200',
  'secondary-container': '#FFE27A',
  'on-secondary-container': '#5D3B00',
  tertiary: '#14CC76',
  'on-tertiary': '#003C1F',
  'tertiary-container': '#99E6BD',
  'on-tertiary-container': '#00230E',
  surface: '#FFFFFF',
  'on-surface': '#201425',
  'surface-dim': '#E0E0E0',
  'surface-bright': '#F5F5F5',
  'surface-container-lowest': '#FFFFFF',
  'surface-container-low': '#F9F9F9',
  'surface-container': '#F5F5F5',
  'on-surface-container': '#201425',
  'surface-container-high': '#ECEFF1',
  'surface-container-highest': '#E0E0E0',
  'on-surface-variant': '#757575',
  error: '#CC0000',
  'on-error': '#FFFFFF',
  'error-container': '#FFD9D9',
  'on-error-container': '#8C0000',
  outline: '#BDBDBD',
  'outline-variant': '#9E9E9E',
  'inverse-surface': '#303030',
  'inverse-on-surface': '#ECEFF1',
  'inverse-primary': '#D1C4E9',
  scrim: '#000000',
  shadow: '#000000',
  // Data visualization colors
  'data-orange': '#FF9F43',
  'data-blue': '#54A0FF',
  'data-pink': '#FF6B81',
  'data-yellow': '#FFA000',
  'data-green': '#14CC76',
  'data-purple': '#5F27CD',
  'data-red': '#FF4757',
  // Gradients (light)
  'data-orange-light': '#FFBE76',
  'data-blue-light': '#81BCFF',
  'data-pink-light': '#FF8FA3',
  // Gradients (dark)
  'data-orange-dark': '#E77E24',
  'data-blue-dark': '#2E7DD1',
  'data-pink-dark': '#D1475C',
};

// --- Environment / URLs ---
export const PASSWORD_RESET_REDIRECT_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/reset-password'
    : 'https://yourdomain.com/reset-password';

// --- App Name ---
export const APP_NAME = 'RippleBase';

// Add more categories below as needed

// --- Layout Breakpoints ---
export const LAYOUT_BREAKPOINTS = {
  mobile: 600,
  tablet: 1024,
  desktop: 1440,
};

// --- Avatar Sizing ---
export const AVATAR = {
  maxHeight: 300,
  maxWidth: 300,
  thumbnail: 48,
  profile: 100,
};

// --- Progress Indicator Sizes ---
export const PROGRESS_INDICATOR = {
  tiny: 16,
  small: 24,
  medium: 36,
  large: 50,
  xlarge: 64,
};

// --- Dialog Sizing & Spacing ---
export const DIALOG = {
  horizontalMargin: 32,
  maxWidthPercentage: 0.85,
  minWidthPercentage: 0.65,
  contentPadding: 24,
};

// --- Button & UI Element Sizing ---
export const BUTTON = {
  padding: 12,
  margin: 12,
  iconSizeSmall: 16,
  iconSizeMedium: 24,
  iconSizeLarge: 32,
};
