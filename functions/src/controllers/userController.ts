import { getUserById } from '../usecases/userUseCases/getUserById';
import { Request, Response } from 'express';

export async function getUserByIdController(req: Request, res: Response) {
  try {
    const { userId } = req.params as { userId: string };
    const result = await getUserById(userId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === 'not-found' ? 404 : 400;
    return res.status(statusCode).json({ error: error.message, code: error.code });
  }
}
