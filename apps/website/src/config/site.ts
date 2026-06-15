/**
 * Site configuration
 * Contains constants and settings for the Twikka website
 */

export const siteConfig = {
  // Brand/Account Configuration
  // Note: Twikka uses its own Supabase instance (trbabdgszrgrcftwyrlc.supabase.co)
  // These IDs are not currently used - remove if not needed
  brandId: 2,
  accountId: null, // No multi-tenant account structure in Twikka Supabase

  // Site Information
  name: 'Twikka',
  shortName: 'Twikka',
  tagline: 'Your health & fitness companion',
  description:
    'Build healthy habits and achieve your wellness goals with Twikka - the app that makes fitness simple and sustainable.',
  url: 'https://twikka.com',

  // Contact Information
  email: 'hello@twikka.com',
  supportEmail: 'support@twikka.com',

  // Social Media & External Links
  social: {
    instagram: 'https://www.instagram.com/twikka.health',
    facebook: 'https://www.facebook.com/profile.php?id=61563892907709',
  },

  // App Store Links (placeholder)
  appLinks: {
    ios: '#', // TODO: Add iOS App Store link
    android: '#', // TODO: Add Google Play link
  },

  // SEO & Meta
  ogImage: '/og-image.jpg',
  twitterHandle: '@twikkaapp',

  // Content Settings
  blog: {
    postsPerPage: 9,
    enableComments: false,
  },

  // Feature Flags
  features: {
    enableBlogSearch: true,
    enableNewsletterSignup: true,
    enableEarlyAccess: true,
  },

  // Navigation Links
  navigation: {
    main: [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    footer: [
      { name: 'Support', href: '/support' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  },
} as const;

// Export individual values for convenience
export const BRAND_ID = siteConfig.brandId;
export const ACCOUNT_ID = siteConfig.accountId;
export const SITE_NAME = siteConfig.name;
export const SITE_URL = siteConfig.url;
