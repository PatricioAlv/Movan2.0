import {
  ref,
  push,
  set,
  get,
  update,
  remove,
  onValue,
  off,
  DatabaseReference,
  DataSnapshot,
} from 'firebase/database';
import { database } from '@data/config/firebase.config';
import { injectable } from 'inversify';

@injectable()
export class FirebaseRealtimeDataSource {
  private getRef(path: string): DatabaseReference {
    return ref(database, path);
  }

  async create<T>(path: string, data: T): Promise<string> {
    const newRef = push(this.getRef(path));
    await set(newRef, data);
    return newRef.key!;
  }

  async get<T>(path: string): Promise<T | null> {
    const snapshot = await get(this.getRef(path));
    return snapshot.exists() ? snapshot.val() : null;
  }

  async update(path: string, data: any): Promise<void> {
    await update(this.getRef(path), data);
  }

  async delete(path: string): Promise<void> {
    await remove(this.getRef(path));
  }

  listen(path: string, callback: (snapshot: DataSnapshot) => void): () => void {
    const dbRef = this.getRef(path);
    onValue(dbRef, callback);
    return () => off(dbRef);
  }
}
