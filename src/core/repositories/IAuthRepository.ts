import { User } from '@core/entities/User';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  register(email: string, password: string, name: string, role:string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
