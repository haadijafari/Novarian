// lib/navigation.ts

export interface AppRoute {
  path: (...args: any[]) => string;
  name: string; // For English contexts
  persianName: string; // For Persian contexts
}

export const ROUTES = {
  HOME: {
    path: () => '/',
    name: 'Home',
    persianName: 'خانه',
  },

  PRODUCTS: {
    path: () => '/products',
    name: 'Products',
    persianName: 'محصولات',
  },

  PRODUCT_DETAIL: {
    path: (slug: string) => `/products/${slug}`,
    name: 'Product',
    persianName: 'محصول', // This will be the prefix for the dynamic part
  },

  PRODUCT_IMAGE_MODAL: {
    path: (slug: string, imageIndex: string,) => `/products/${slug}/image/${imageIndex}`,
    name: 'Product',
    persianName: '',
  },

  AUTH: {
    path: () => '/login',
    name: 'Login',
    persianName: 'ورود',
  },
} as const;
