import { IAuthRepository, LoginCredentials } from '@core/repositories/IAuthRepository';
import { User } from '@core/entities/User';
import { FirebaseAuthDataSource } from '@data/datasources/remote/FirebaseAuthDataSource';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { UserMapper } from '@data/models/mappers/UserMapper';
import { UserModel } from '@data/models/UserModel';
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class FirebaseAuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.FirebaseAuthDataSource) private authDataSource: FirebaseAuthDataSource,
    @inject(TYPES.FirebaseRealtimeDataSource) private realtimeDataSource: FirebaseRealtimeDataSource
  ) {}

  async login(credentials: LoginCredentials): Promise<User> {
    const firebaseUser = await this.authDataSource.signIn(
      credentials.email,
      credentials.password
    );

    const userData = await this.realtimeDataSource.get<UserModel>(`users/${firebaseUser.uid}`);
    
    if (!userData) {
      throw new Error('User data not found');
    }

    return UserMapper.toDomain(userData);
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const firebaseUser = await this.authDataSource.signUp(email, password);
    
    const now = Date.now();
    const userModel: UserModel = {
      id: firebaseUser.uid,
      email,
      name,
      createdAt: now,
      updatedAt: now,
    };

    await this.realtimeDataSource.update(`users/${firebaseUser.uid}`, userModel);

    return UserMapper.toDomain(userModel);
  }

  async logout(): Promise<void> {
    await this.authDataSource.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = this.authDataSource.getCurrentUser();
    
    if (!firebaseUser) {
      return null;
    }

    const userData = await this.realtimeDataSource.get<UserModel>(`users/${firebaseUser.uid}`);
    
    if (!userData) {
      return null;
    }

    return UserMapper.toDomain(userData);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.authDataSource.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      const userData = await this.realtimeDataSource.get<UserModel>(`users/${firebaseUser.uid}`);
      
      if (userData) {
        callback(UserMapper.toDomain(userData));
      } else {
        callback(null);
      }
    });
  }
}
