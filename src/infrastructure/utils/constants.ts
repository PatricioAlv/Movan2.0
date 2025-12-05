export const STORAGE_KEYS = {
  USER_TOKEN: '@movan/user_token',
  USER_DATA: '@movan/user_data',
  THEME: '@movan/theme',
  LANGUAGE: '@movan/language',
};

// Lee la URL base desde las variables de entorno
export const API_BASE_URL = process.env.API_BASE_URL || 'https://us-central1-movan-857e9.cloudfunctions.net/api';

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  // Transportist endpoints
  GET_DRIVER_SHIPMENTS: '/getDriverShipments',
  GET_SHIPMENT_DETAILS: '/getShipmentDetails',
  ACCEPT_SHIPMENT: '/acceptShipment',
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

  // Transportist
  TRANS_HOME: 'TransHome',
  TRANS_BROWSER: 'TransBrowser',
  
  // Shared
  ACCOUNT_SETTINGS: 'AccountSettings',
  
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
