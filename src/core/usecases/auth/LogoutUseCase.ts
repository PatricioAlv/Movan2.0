import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@infrastructure/utils/constants';

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<void> {
    try {
      // Cerrar sesión en Firebase
      await this.authRepository.logout();
      
      // Limpiar datos del usuario en AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      
      // Limpiar cualquier otro dato de sesión
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_TOKEN,
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('No se pudo cerrar sesión correctamente');
    }
  }
}
