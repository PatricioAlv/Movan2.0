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
  // Shipment endpoints
  CREATE_SHIPMENT: '/shipments',
  GET_AVAILABLE_SHIPMENTS: '/shipments/available',
  GET_CLIENT_SHIPMENTS: '/shipments/client', // + /:clientId
  GET_DRIVER_SHIPMENTS: '/shipments/driver', // + /:driverId
  GET_SHIPMENT_BY_ID: '/shipments', // + /:shipmentId
  CANCEL_SHIPMENT: '/shipments/cancel',
  UPDATE_SHIPMENT_STATUS: '/shipments/updateStatus',
  START_PICKUP: '/shipments/startPickup',
  CONFIRM_DELIVERY: '/shipments/confirmDelivery',
  ACCEPT_SHIPMENT: '/shipments/accept',
  // User endpoints
  GET_USER: '/users', // + /:userId
  UPDATE_USER: '/users', // + /:userId
  DELETE_USER: '/users', // + /:userId
  CHANGE_PASSWORD: '/users', // + /:userId/password
  // Rating endpoints
  CREATE_RATING: '/ratings',
  GET_USER_RATINGS: '/ratings/user', // + /:userId
  GET_AVERAGE_RATING: '/ratings/average', // + /:userId
  CHECK_USER_RATED: '/ratings/check', // + /:shipmentId/:userId
  GET_SHIPMENT_RATINGS: '/ratings/shipment', // + /:shipmentId
  DELETE_RATING: '/ratings', // + /:ratingId
  // Maps endpoints
  MAPS_SEARCH: '/maps/search',
  MAPS_DETAILS: '/maps/details',
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
