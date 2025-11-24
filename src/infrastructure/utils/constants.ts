export const STORAGE_KEYS = {
  USER_TOKEN: '@movan/user_token',
  USER_DATA: '@movan/user_data',
  THEME: '@movan/theme',
  LANGUAGE: '@movan/language',
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  ORDERS: '/orders',
};

export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
};

export const SCREEN_NAMES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Products
  PRODUCT_LIST: 'ProductList',
  PRODUCT_DETAIL: 'ProductDetail',
  
  // Client
  CLIENT_HOME: 'ClientHome',
  CREATE_SHIPMENT: 'CreateShipment',
  
  // Main
  HOME: 'Home',
  PROFILE: 'Profile',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de red. Por favor, verifica tu conexión.',
  AUTH_ERROR: 'Error de autenticación. Por favor, intenta nuevamente.',
  GENERIC_ERROR: 'Ocurrió un error. Por favor, intenta nuevamente.',
  REQUIRED_FIELD: 'Este campo es requerido.',
  INVALID_EMAIL: 'Email inválido.',
  WEAK_PASSWORD: 'La contraseña debe tener al menos 6 caracteres.',
};
