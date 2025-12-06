import * as admin from "firebase-admin";

interface ChangePasswordData {
  newPassword: string;
}

export async function changePassword(
  userId: string,
  data: ChangePasswordData
): Promise<{ success: boolean; message: string }> {
  const db = admin.database();
  const userRef = db.ref(`users/${userId}`);

  // Verificar que el usuario existe
  const snapshot = await userRef.once("value");
  if (!snapshot.exists()) {
    const error = new Error("Usuario no encontrado");
    (error as any).code = "not-found";
    throw error;
  }

  // Validar la nueva contraseña
  if (!data.newPassword || data.newPassword.length < 6) {
    const error = new Error("La contraseña debe tener al menos 6 caracteres");
    (error as any).code = "weak-password";
    throw error;
  }

  // Actualizar contraseña en Firebase Auth
  try {
    await admin.auth().updateUser(userId, {
      password: data.newPassword,
    });
  } catch (authError: any) {
    console.error("Error actualizando contraseña:", authError);
    const error = new Error("No se pudo actualizar la contraseña");
    (error as any).code = "auth-error";
    throw error;
  }

  // Actualizar timestamp en la base de datos
  await userRef.update({
    passwordChangedAt: admin.database.ServerValue.TIMESTAMP,
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  });

  return {
    success: true,
    message: "Contraseña actualizada correctamente",
  };
}
