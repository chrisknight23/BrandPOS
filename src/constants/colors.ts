// Brand Colors - Single source of truth for all component colors
export const BRAND_COLORS = {
  // Primary brand color (olive green)
  primary: '#5D5D3F',
  primaryDark: '#4A4A32',
  primaryExpanded: '#3B3B28',
  
  // Secondary brand colors
  secondary: '#96151D',
  accent: '#00B843',
  accentDark: '#004D1C',
  
  // UI Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Border colors
  borderLight: 'rgba(255, 255, 255, 0.2)',
  borderTransparent: 'rgba(255, 255, 255, 0)',
} as const;

// Helper function to convert hex to Tailwind class format
export const toTailwindClass = (color: string): string => {
  return `bg-[${color}]`;
};

// Helper function to get color from Tailwind class
export const fromTailwindClass = (tailwindClass: string): string => {
  const match = tailwindClass.match(/bg-\[(#[0-9A-Fa-f]{6})\]/);
  return match ? match[1] : tailwindClass;
}; 