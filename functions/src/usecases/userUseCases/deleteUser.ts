import * as admin from "firebase-admin";
import {ServerValue} from "firebase-admin/database";

export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  const db = admin.database();
  const userRef = db.ref(`users/${userId}`);

  const snapshot = await userRef.once("value");
  if (!snapshot.exists()) {
    const error = new Error("Usuario no encontrado");
    (error as any).code = "not-found";
    throw error;
  }

  // Soft delete: marcar como inactivo en lugar de eliminar
  await userRef.update({
    isActive: false,
    deletedAt: ServerValue.TIMESTAMP,
    updatedAt: ServerValue.TIMESTAMP,
  });

  // Opcional: También desactivar en Firebase Auth
  try {
    await admin.auth().updateUser(userId, {
      disabled: true,
    });
  } catch (authError) {
    console.error("Error desactivando usuario en Auth:", authError);
    // No lanzar error, el usuario ya fue marcado como inactivo en DB
  }

  return {
    success: true,
    message: "Usuario desactivado correctamente",
  };
}
