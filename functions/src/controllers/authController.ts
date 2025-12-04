import { registerUser } from '../usecases/registerUser';
import { loginUser } from '../usecases/loginUser';

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, code: error.code });
  }
}

export async function login(req ,res) {
    try {
        const { email, password } = req.body;
        const result = await loginUser({email, password});
        return res.json({success: true, ...result})
    } catch (error: any) {
        return res.status(400).json({ error: error.message, code: error.code })
    }
} 