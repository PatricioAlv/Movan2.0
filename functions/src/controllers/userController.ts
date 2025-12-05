import {getUserById} from "../usecases/userUseCases/getUserById";
import {updateUser} from "../usecases/userUseCases/updateUser";
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
