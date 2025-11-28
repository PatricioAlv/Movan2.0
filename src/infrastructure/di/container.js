import { Container } from 'inversify';
import { TYPES } from './types.js';

// DataSources
import { CloudFunctionsDataSource } from '@data/datasources/remote/CloudFunctionsDataSource.js';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource.js';

const container = new Container();

// Registrar Cloud Functions DataSource
container.bind(TYPES.CloudFunctionsDataSource).to(CloudFunctionsDataSource);

// Registrar Realtime DataSource
container.bind(TYPES.FirebaseRealtimeDataSource).to(FirebaseRealtimeDataSource);

// ... resto de registros

export { container };
