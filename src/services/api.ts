const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const API = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    // REGISTER: `${BASE_URL}/auth/register`,
    // LOGOUT: `${BASE_URL}/auth/logout`,
    // REFRESH: `${BASE_URL}/auth/refresh-token`,
    ME: `${BASE_URL}/auth/me`,
  },

  // USERS: {
  //   GET_ALL: `${BASE_URL}/users`,
  //   GET_BY_ID: (id: string) => `${BASE_URL}/users/${id}`,
  //   UPDATE: (id: string) => `${BASE_URL}/users/${id}`,
  //   DELETE: (id: string) => `${BASE_URL}/users/${id}`,
  // },

  PRODUCTS: {
    GET_ALL: `${BASE_URL}/products`,
    // GET_BY_ID: (id: string) => `${BASE_URL}/products/${id}`,
    CREATE: `${BASE_URL}/products`,
    UPDATE: (id: string) => `${BASE_URL}/products/${id}`,
    DELETE: (id: string) => `${BASE_URL}/products/${id}`,
  },

  // ORDERS: {
  //   GET_ALL: `${BASE_URL}/orders`,
  //   GET_BY_ID: (id: string) => `${BASE_URL}/orders/${id}`,
  //   CREATE: `${BASE_URL}/orders`,
  //   UPDATE: (id: string) => `${BASE_URL}/orders/${id}`,
  //   DELETE: (id: string) => `${BASE_URL}/orders/${id}`,
  // },
};
