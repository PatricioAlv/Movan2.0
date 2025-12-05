import * as admin from 'firebase-admin';

export async function getUserById(userId: string) {
  if (!userId) {
    throw { code: 'missing-user-id', message: 'El ID del usuario es requerido' };
  }

  const userRef = admin.database().ref(`users/${userId}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists()) {
    throw { code: 'not-found', message: 'Usuario no encontrado' };
  }

  return {
    id: userId,
    ...snapshot.val(),
  };
}
