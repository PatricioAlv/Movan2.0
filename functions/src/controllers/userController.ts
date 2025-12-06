import {getUserById} from "../usecases/userUseCases/getUserById";
import {updateUser} from "../usecases/userUseCases/updateUser";
import {deleteUser} from "../usecases/userUseCases/deleteUser";
import {getUsersByRole} from "../usecases/userUseCases/getUsersByRole";
import {changePassword} from "../usecases/userUseCases/changePassword";
import {Request, Response} from "express";

export async function getUserByIdController(req: Request, res: Response) {
  try {
    const {userId} = req.params as { userId: string };
    const result = await getUserById(userId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const {userId} = req.params as { userId: string };
    const {name, phone} = req.body;

    const result = await updateUser(userId, {name, phone});
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const {userId} = req.params as { userId: string };
    const result = await deleteUser(userId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function getUsersByRoleController(req: Request, res: Response) {
  try {
    const {role} = req.params as { role: string };
    const result = await getUsersByRole(role);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "invalid-role" ? 400 : 500;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function changePasswordController(req: Request, res: Response) {
  try {
    const {userId} = req.params as { userId: string };
    const {newPassword} = req.body;

    if (!newPassword) {
      return res.status(400).json({
        error: "Se requiere newPassword",
        code: "missing-password",
      });
    }

    const result = await changePassword(userId, {newPassword});
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 :
                       error.code === "weak-password" ? 400 : 500;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}
