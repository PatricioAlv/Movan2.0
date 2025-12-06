import * as admin from "firebase-admin";
import {ServerValue} from "firebase-admin/database";

interface UpdateUserData {
  name?: string;
  phone?: string;
}

export async function updateUser(userId: string, data: UpdateUserData): Promise<any> {
  const db = admin.database();
  const userRef = db.ref(`users/${userId}`);

  const snapshot = await userRef.once("value");
  if (!snapshot.exists()) {
    const error = new Error("Usuario no encontrado");
    (error as any).code = "not-found";
    throw error;
  }

  const updates: any = {
    updatedAt: ServerValue.TIMESTAMP,
  };

  if (data.name !== undefined) {
    updates.name = data.name;
  }

  if (data.phone !== undefined) {
    updates.phone = data.phone;
  }

  await userRef.update(updates);

  // Retornar el usuario actualizado
  const updatedSnapshot = await userRef.once("value");
  return {
    id: userId,
    ...updatedSnapshot.val(),
  };
}
