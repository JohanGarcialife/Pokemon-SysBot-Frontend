export const API_ROUTES = {
  meta: '/api/meta',
  pokemon: (game: 'za' | 'sv') => `/api/${game}/pokemon`,
  encounters: (game: 'za' | 'sv', species: number, form = 0) => `/api/${game}/pokemon/${species}/encounters?form=${form}`,
  validate: (game: 'za' | 'sv') => `/api/${game}/validate`,
  singleOrder: '/api/orders/single',
  bulkOrder: '/api/orders/bulk',
};
