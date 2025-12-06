import * as admin from "firebase-admin";

export async function getUsersByRole(role: string): Promise<any[]> {
  const db = admin.database();
  const usersRef = db.ref("users");

  // Validar roles permitidos
  const validRoles = ["CLIENT", "TRANSPORTIST", "ADMIN"];
  const normalizedRole = role.toUpperCase();

  if (!validRoles.includes(normalizedRole)) {
    const error = new Error(`Rol inválido. Roles válidos: ${validRoles.join(", ")}`);
    (error as any).code = "invalid-role";
    throw error;
  }

  const snapshot = await usersRef
    .orderByChild("role")
    .equalTo(normalizedRole)
    .once("value");

  const usersData = snapshot.val() || {};

  // Convertir a array y filtrar usuarios activos
  const users = Object.entries(usersData)
    .map(([id, data]: [string, any]) => ({
      id,
      ...data,
      // No incluir información sensible
      password: undefined,
    }))
    .filter((user) => user.isActive !== false); // Excluir usuarios desactivados

  return users;
}
