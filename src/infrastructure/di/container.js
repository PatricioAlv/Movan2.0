import { Container } from 'inversify';
import { TYPES } from './types.js';

// DataSources
import { CloudFunctionsDataSource } from '@data/datasources/remote/CloudFunctionsDataSource.js';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { FirebaseAuthDataSource } from '@data/datasources/remote/FirebaseAuthDataSource';

// IAuthRepo
import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { FirebaseAuthRepository } from '@data/repositories/FirebaseAuthRepository';

const container = new Container();

// Registrar Cloud Functions DataSource
container.bind(TYPES.CloudFunctionsDataSource).to(CloudFunctionsDataSource);

// Registrar Realtime DataSource
container.bind(TYPES.FirebaseRealtimeDataSource).to(FirebaseRealtimeDataSource);

// IAuthRepository
container.bind(TYPES.IAuthRepository).to(FirebaseAuthRepository);

// Firebase Auth DataSource
container.bind(TYPES.FirebaseAuthDataSource).to(FirebaseAuthDataSource);

// ... resto de registros

export { container };
