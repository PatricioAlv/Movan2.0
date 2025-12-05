
export async function loginUser({ email, password }: { email: string, password: string }) {
  if (!email || !password) {
    throw { code: 'missing-fields', message: 'Por favor ingresa email y contraseña' };
  }
  
  const apiKey = process.env.FIREBASE_API_KEY; 
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const data = await response.json();
  if (data.error) {
    throw { code: data.error.message, message: 'Credenciales inválidas' };
  }
  return { idToken: data.idToken, uid: data.localId };
}