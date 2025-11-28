import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateEmail, validatePassword, validateRole, validateRequired } from '../utils/validation.js';
    
export const register = functions.https.onCall(async (data, context) => {
  const { email, password, name, role } = data;

  // Validaciones
  validateRequired({ email, password, name, role });
  validateEmail(email);
  validatePassword(password);
  validateRole(role);

  if (name.length < 2) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'El nombre debe tener al menos 2 caracteres'
    );
  }

  try {
    // Crear usuario en Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Crear perfil en Realtime Database
    const userData = {
      id: userRecord.uid,
      email,
      name,
      role,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      updatedAt: admin.database.ServerValue.TIMESTAMP
    };

    await admin.database().ref(`users/${userRecord.uid}`).set(userData);

    // Custom Claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    functions.logger.info(`Usuario registrado: ${userRecord.uid}`, { email, role });

    return {
      success: true,
      userId: userRecord.uid,
      message: 'Usuario registrado exitosamente'
    };
  } catch (error) {
    functions.logger.error('Error en registro:', error);

    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError(
        'already-exists',
        'Este email ya está registrado'
      );
    }

    throw new functions.https.HttpsError('internal', error.message);
  }
});
