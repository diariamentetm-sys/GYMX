/**
 * Design System Constants
 * Valores centralizados do sistema de design GymX
 */

// Colors
export const COLORS = {
  // Neutral Scale
  neutral: {
    950: "#0D0D0D",
    900: "#1A1A1A",
    800: "#222222",
    700: "#2E2E2E",
    500: "#444444",
    300: "#888888",
    50: "#F5F5F5",
  },
  // Primary Accent (Yellow)
  yellow: {
    400: "#E5C000",
    300: "#F0D000",
    900: "#1A1200",
  },
  // Secondary Accent (Orange)
  orange: {
    500: "#FF5A1A",
    700: "#CC3D00",
    50: "#FFF0E8",
  },
  white: "#FFFFFF",
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    display: "'Bebas Neue', 'Barlow Condensed', 'Anton', sans-serif",
    body: "'Inter', 'DM Sans', 'Manrope', sans-serif",
  },
  fontSize: {
    h1: "80px",
    h2: "48px",
    h3: "28px",
    h4: "18px",
    body: "15px",
    caption: "12px",
    label: "11px",
    stat: "36px",
  },
  fontWeight: {
    black: 900,
    bold: 700,
    semibold: 600,
    medium: 500,
    normal: 400,
  },
} as const;

// Spacing
export const SPACING = {
  1: "4px",
  2: "8px",
  3: "16px",
  4: "24px",
  5: "32px",
  6: "48px",
  7: "64px",
  8: "80px",
  9: "120px",
} as const;

// Border Radius
export const RADIUS = {
  none: "0px",
  sm: "4px",
  md: "8px",
  pill: "999px",
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Animation Durations
export const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.6,
    verySlow: 0.8,
  },
  easing: {
    default: "easeOut",
    smooth: "easeInOut",
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
} as const;

// Navigation Items
export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
] as const;

// Social Links
export const SOCIAL_LINKS = [
  { name: "Facebook", url: "https://facebook.com" },
  { name: "Instagram", url: "https://instagram.com" },
  { name: "Youtube", url: "https://youtube.com" },
] as const;

// Contact Info
export const CONTACT_INFO = {
  address: {
    street: "Rua do Fitness, 123",
    city: "São Paulo",
    state: "SP",
  },
  phone: "+55 11 98765-4321",
  email: "contato@gymx.com.br",
} as const;
