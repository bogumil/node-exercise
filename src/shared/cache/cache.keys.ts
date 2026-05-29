export const CACHE_PREFIX = {
  users: 'users',
  organizations: 'organizations',
  orders: 'orders',
} as const;

export const cacheKeys = {
  users: {
    prefix: `${CACHE_PREFIX.users}:`,
    list: (query: string) => `${CACHE_PREFIX.users}:list:${query}`,
    detail: (id: string) => `${CACHE_PREFIX.users}:detail:${id}`,
  },

  organizations: {
    prefix: `${CACHE_PREFIX.organizations}:`,
    list: (query: string) => `${CACHE_PREFIX.organizations}:list:${query}`,
    detail: (id: string) => `${CACHE_PREFIX.organizations}:detail:${id}`,
  },

  orders: {
    prefix: `${CACHE_PREFIX.orders}:`,
    list: (query: string) => `${CACHE_PREFIX.orders}:list:${query}`,
    detail: (id: string) => `${CACHE_PREFIX.orders}:detail:${id}`,
  },
} as const;
