import { Container } from 'inversify';
import { TYPES } from './types.js';

// DataSources
import { CloudFunctionsDataSource } from '@data/datasources/remote/CloudFunctionsDataSource.js';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';

// IAuthRepo
import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { AuthRepositoryImpl } from '@data/repositories/FirebaseAuthRepository';

const container = new Container();

// Registrar Cloud Functions DataSource
container.bind(TYPES.CloudFunctionsDataSource).to(CloudFunctionsDataSource);

// Registrar Realtime DataSource
container.bind(TYPES.FirebaseRealtimeDataSource).to(FirebaseRealtimeDataSource);

// IAuthRepository
container.bind(TYPES.IAuthRepository).to(AuthRepositoryImpl);

// ... resto de registros

export { container };
