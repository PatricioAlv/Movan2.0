import { https } from 'firebase-functions';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new https.HttpsError('invalid-argument', 'Email inválido');
  }
};

const validatePassword = (password) => {
  if (!password || password.length < 6) {
    throw new https.HttpsError(
      'invalid-argument',
      'La contraseña debe tener al menos 6 caracteres'
    );
  }
};

const validateRole = (role) => {
  if (!['client', 'driver'].includes(role)) {
    throw new https.HttpsError('invalid-argument', 'Rol inválido');
  }
};

const validateRequired = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') {
      throw new https.HttpsError(
        'invalid-argument',
        `El campo ${key} es requerido`
      );
    }
  }
};

export default {
  validateEmail,
  validatePassword,
  validateRole,
  validateRequired
};
