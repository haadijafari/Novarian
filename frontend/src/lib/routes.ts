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
    path: ({ slug }: { slug: string }) => `/products/${slug}`,
    name: 'Product',
    persianName: 'محصول', // This will be the prefix for the dynamic part
  },

  PRODUCT_IMAGE_MODAL: {
    path: ({ slug, imageIndex }: { slug: string, imageIndex: string, }) => `/products/${slug}/image/${imageIndex}`,
    name: 'Product',
    persianName: 'گالری',
  },

  AUTH: {
    path: () => '/login',
    name: 'Login',
    persianName: 'ورود',
  },
} as const;

export type RouteName = keyof typeof ROUTES;

type StaticRouteProps<T extends RouteName> = {
  route: typeof ROUTES[T];
  routeArgs?: never;
};

type DynamicRouteProps<T extends RouteName> = {
  route: typeof ROUTES[T];
  routeArgs: Parameters<typeof ROUTES[T]['path']>[0];
};

//  Resolves the correct prop shape for a given route by determining if its
//  path is static or dynamic.
// 
//  If the route's `path` function has parameters (i.e., its parameter
//  count is greater than zero), it is considered a **dynamic route**.
// 
//  If the `path` function has no parameters, it is considered a
//  **static route**.

export type RouteSpecificProps<T extends RouteName> = Parameters<
  typeof ROUTES[T]['path']
>['length'] extends 0
  ? StaticRouteProps<T>
  : DynamicRouteProps<T>;
