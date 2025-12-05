import * as admin from 'firebase-admin';

export async function registerUser({ name, email, password, role }: { name: string, email: string, password: string, role: string }) {
  if (!name || !email || !password || !role) {
    throw { code: 'missing-fields', message: 'Todos los campos son requeridos' };
  }
  if (name.length < 2) {
    throw { code: 'invalid-name', message: 'El nombre debe tener al menos 2 caracteres' };
  }
  if (password.length < 6) {
    throw { code: 'weak-password', message: 'La contraseña debe tener al menos 6 caracteres' };
  }

  const userRecord = await admin.auth().createUser({ email, password, displayName: name });
  const now = Date.now();
  
  await admin.database().ref(`users/${userRecord.uid}`).set({
    id: userRecord.uid,
    email,
    name,
    role,
    createdAt: now,
    updatedAt: now,
  });

  return { uid: userRecord.uid };
}