import * as SecureStore from 'expo-secure-store';
import { injectable } from 'inversify';

@injectable()
export class SecureStorageDataSource {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  }

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}
