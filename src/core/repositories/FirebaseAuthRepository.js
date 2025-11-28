import { injectable, inject } from 'inversify';
import { CloudFunctionsDataSource } from '@data/datasources/remote/CloudFunctionsDataSource';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { UserMapper } from '@data/models/mappers/UserMapper';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class FirebaseAuthRepository {
  constructor(
    @inject(TYPES.CloudFunctionsDataSource)
    cloudFunctionsDataSource,
    @inject(TYPES.FirebaseRealtimeDataSource)
    realtimeDataSource
  ) {
    this.cloudFunctionsDataSource = cloudFunctionsDataSource;
    this.realtimeDataSource = realtimeDataSource;
  }

  async register(email, password, name) {
    // Llamar a Cloud Function
    const result = await this.cloudFunctionsDataSource.register(
      email,
      password,
      name,
      'client'
    );

    // Obtener datos del usuario
    const userModel = await this.realtimeDataSource.getData(
      `users/${result.userId}`
    );

    return UserMapper.toDomain(userModel);
  }

  // ... otros métodos
}
