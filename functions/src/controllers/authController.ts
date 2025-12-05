
import { Request, Response } from 'express';
import { registerUser } from '../usecases/authUseCases/registerUser';
import { loginUser } from '../usecases/authUseCases/loginUser';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, code: error.code });
  }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const result = await loginUser({email, password});
        return res.json({success: true, ...result})
    } catch (error: any) {
        return res.status(400).json({ error: error.message, code: error.code })
    }
} 