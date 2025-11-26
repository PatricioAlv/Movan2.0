import { User } from '@core/entities/User';

export interface UpdateUserData {
  name?: string;
  phone?: string;
  email?: string;
}

export interface IUserRepository {
  getUserById(userId: string): Promise<User | null>;
  updateUser(userId: string, data: UpdateUserData): Promise<void>;
}
