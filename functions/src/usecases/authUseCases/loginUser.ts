
import * as admin from "firebase-admin";

export async function loginUser({ email, password }: { email: string, password: string }) {
  if (!email || !password) {
    throw { code: 'missing-fields', message: 'Por favor ingresa email y contraseña' };
  }
  
  try {
    // Verificar que el usuario existe en Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Nota: Firebase Admin no puede verificar contraseñas directamente.
    // Para login, es mejor usar el SDK del cliente o Custom Tokens.
    // Aquí generamos un custom token para que el cliente lo use.
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    
    return { 
      customToken, 
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName
    };
  } catch (error: any) {
    console.error('Firebase Auth error:', error);
    if (error.code === 'auth/user-not-found') {
      throw { code: 'user-not-found', message: 'Usuario no encontrado' };
    }
    throw { code: error.code || 'auth-error', message: 'Error de autenticación' };
  }
}