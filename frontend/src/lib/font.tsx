import localFont from 'next/font/local';

/**
 * Vazirmatn Font
 * A modern and highly readable Persian font.
 * Using the variable option for easy use with Tailwind CSS or CSS variables.
 */
export const vazirmatn = localFont({
  src: '../app/font/Vazirmatn-UI-FD-NL-Regular.woff2',
  display: 'swap', // Use 'swap' for better performance
  variable: '--font-vazirmatn',
});

/**
 * Sahel Font
 * Another popular and clean Persian font.
 */
export const sahel = localFont({
  src: '../app/font/Sahel.woff2',
  display: 'swap',
  variable: '--font-sahel',
});

/**
 * Estedad Font
 * A classic and elegant choice.
 */
export const estedad = localFont({
  src: '../app/font/Estedad-Regular.woff2',
  display: 'swap',
  variable: '--font-estedad',
});

/**
 * Tanha Font
 * A friendly and simple font. Note: .ttf files are larger than .woff2.
 * Consider converting to .woff2 for better web performance if possible.
 */
export const tanha = localFont({
  src: '../app/font/Tanha.ttf',
  display: 'swap',
  variable: '--font-tanha',
});

