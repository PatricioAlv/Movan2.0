import { IAuthRepository, LoginCredentials } from '@core/repositories/IAuthRepository';
import { User } from '@core/entities/User';
import { FirebaseAuthDataSource } from '@data/datasources/remote/FirebaseAuthDataSource';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { UserMapper } from '@data/models/mappers/UserMapper';
import { UserModel } from '@data/models/UserModel';
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import { get, ref, set } from "firebase/database";
import { auth, database } from "../config/firebase.config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

@injectable()
export class FirebaseAuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.FirebaseRealtimeDataSource) private authDataSource: FirebaseAuthDataSource,
    @inject(TYPES.FirebaseRealtimeDataSource) private realtimeDataSource: FirebaseRealtimeDataSource
  ) {}

  /////////////////////////

  async login(credentials: LoginCredentials): Promise<User> {
    const { email, password } = credentials;
    const authData = await signInWithEmailAndPassword(auth, email, password);
    const uid = authData.user.uid;

    const snap = await get(ref(database, `user/${uid}`));

    if(!snap.exists()){
      throw new Error("No se encontró el usuario en la base de datos");
    }

    return snap.val() as User;
  }

  async register(email: string, password: string, name: string, role: string): Promise<User> {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credentials.user.uid;
    
    const now = new Date();

    const userModel: UserModel = {
      id: uid,
      email,
      name,
      role,
      createdAt: now,
      updatedAt: now,
    };

    await set(ref(database, `users/${uid}`), userModel);

    return userModel;
  }

  async logout(): Promise<void> {
    await this.authDataSource.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const current = auth.currentUser;
    if (!current) return null;

    const snap = await get(ref(database, `users/${current.uid}`));
    if (!snap.exists()) return null;

    return snap.val() as User;
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
