import { injectable, inject } from 'inversify';
import { IUserRepository, UpdateUserData } from '@core/repositories/IUserRepository';
import { User } from '@core/entities/User';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { TYPES } from '@infrastructure/di/types';
import { UserModel } from '@data/models/UserModel';

@injectable()
export class FirebaseUserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.FirebaseRealtimeDataSource) private realtimeDataSource: FirebaseRealtimeDataSource
  ) {}

  async getUserById(userId: string): Promise<User | null> {
    const userData = await this.realtimeDataSource.get<UserModel>(`users/${userId}`);
    return userData as User | null;
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<void> {
    const updates: any = {
      ...data,
      updatedAt: new Date(),
    };
    
    await this.realtimeDataSource.update(`users/${userId}`, updates);
  }
}
