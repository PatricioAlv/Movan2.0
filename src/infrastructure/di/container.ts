import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Repositories
import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { IProductRepository } from '@core/repositories/IProductRepository';
import { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import { FirebaseAuthRepository } from '@data/repositories/FirebaseAuthRepository';
import { FirebaseProductRepository } from '@data/repositories/FirebaseProductRepository';
import { FirebaseShipmentRepository } from '@data/repositories/FirebaseShipmentRepository';

// DataSources
import { FirebaseAuthDataSource } from '@data/datasources/remote/FirebaseAuthDataSource';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { FirebaseShipmentDataSource } from '@data/datasources/remote/FirebaseShipmentDataSource';
import { AsyncStorageDataSource } from '@data/datasources/local/AsyncStorageDataSource';
import { SecureStorageDataSource } from '@data/datasources/local/SecureStorageDataSource';

// Use Cases
import { LoginUseCase } from '@core/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '@core/usecases/auth/RegisterUseCase';
import { LogoutUseCase } from '@core/usecases/auth/LogoutUseCase';
import { GetProductsUseCase } from '@core/usecases/products/GetProductsUseCase';
import { CreateProductUseCase } from '@core/usecases/products/CreateProductUseCase';
import { CreateShipmentUseCase } from '@core/usecases/shipments/CreateShipmentUseCase';
import { GetClientShipmentsUseCase } from '@core/usecases/shipments/GetClientShipmentsUseCase';
import { GetShipmentByIdUseCase } from '@core/usecases/shipments/GetShipmentByIdUseCase';
import { CancelShipmentUseCase } from '@core/usecases/shipments/CancelShipmentUseCase';

const container = new Container({ defaultScope: 'Singleton' });

// Crear instancias manualmente de los DataSources
console.log('Creating FirebaseShipmentDataSource instance...');
const firebaseShipmentDataSource = new FirebaseShipmentDataSource();
console.log('Creating FirebaseAuthDataSource instance...');
const firebaseAuthDataSource = new FirebaseAuthDataSource();
console.log('Creating FirebaseRealtimeDataSource instance...');
const firebaseRealtimeDataSource = new FirebaseRealtimeDataSource();
console.log('Creating AsyncStorageDataSource instance...');
const asyncStorageDataSource = new AsyncStorageDataSource();
console.log('Creating SecureStorageDataSource instance...');
const secureStorageDataSource = new SecureStorageDataSource();

// Bind DataSources como constantes
console.log('Binding FirebaseShipmentDataSource...');
container.bind<FirebaseShipmentDataSource>(TYPES.FirebaseShipmentDataSource).toConstantValue(firebaseShipmentDataSource);
console.log('Binding FirebaseAuthDataSource...');
container.bind<FirebaseAuthDataSource>(TYPES.FirebaseAuthDataSource).toConstantValue(firebaseAuthDataSource);
console.log('Binding FirebaseRealtimeDataSource...');
container.bind<FirebaseRealtimeDataSource>(TYPES.FirebaseRealtimeDataSource).toConstantValue(firebaseRealtimeDataSource);
console.log('Binding AsyncStorageDataSource...');
container.bind<AsyncStorageDataSource>(TYPES.AsyncStorageDataSource).toConstantValue(asyncStorageDataSource);
console.log('Binding SecureStorageDataSource...');
container.bind<SecureStorageDataSource>(TYPES.SecureStorageDataSource).toConstantValue(secureStorageDataSource);

// Crear instancias de Repositories manualmente
console.log('Creating FirebaseShipmentRepository instance...');
const firebaseShipmentRepository = new FirebaseShipmentRepository(firebaseShipmentDataSource);
console.log('Creating FirebaseAuthRepository instance...');
const firebaseAuthRepository = new FirebaseAuthRepository(firebaseAuthDataSource, asyncStorageDataSource);
console.log('Creating FirebaseProductRepository instance...');
const firebaseProductRepository = new FirebaseProductRepository(firebaseRealtimeDataSource);

// Bind Repositories como constantes
console.log('Binding FirebaseShipmentRepository...');
container.bind<IShipmentRepository>(TYPES.IShipmentRepository).toConstantValue(firebaseShipmentRepository);
console.log('Binding FirebaseAuthRepository...');
container.bind<IAuthRepository>(TYPES.IAuthRepository).toConstantValue(firebaseAuthRepository);
console.log('Binding FirebaseProductRepository...');
container.bind<IProductRepository>(TYPES.IProductRepository).toConstantValue(firebaseProductRepository);

// Crear instancias de Use Cases manualmente
console.log('Creating CreateShipmentUseCase instance...');
const createShipmentUseCase = new CreateShipmentUseCase(firebaseShipmentRepository);
console.log('Creating GetClientShipmentsUseCase instance...');
const getClientShipmentsUseCase = new GetClientShipmentsUseCase(firebaseShipmentRepository);
console.log('Creating GetShipmentByIdUseCase instance...');
const getShipmentByIdUseCase = new GetShipmentByIdUseCase(firebaseShipmentRepository);
console.log('Creating CancelShipmentUseCase instance...');
const cancelShipmentUseCase = new CancelShipmentUseCase(firebaseShipmentRepository);

// Bind Use Cases como constantes
console.log('Binding LoginUseCase...');
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
console.log('Binding RegisterUseCase...');
container.bind<RegisterUseCase>(TYPES.RegisterUseCase).to(RegisterUseCase);
console.log('Binding LogoutUseCase...');
container.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);
console.log('Binding GetProductsUseCase...');
container.bind<GetProductsUseCase>(TYPES.GetProductsUseCase).to(GetProductsUseCase);
console.log('Binding CreateProductUseCase...');
container.bind<CreateProductUseCase>(TYPES.CreateProductUseCase).to(CreateProductUseCase);
console.log('Binding CreateShipmentUseCase...');
container.bind<CreateShipmentUseCase>(TYPES.CreateShipmentUseCase).toConstantValue(createShipmentUseCase);
console.log('Binding GetClientShipmentsUseCase...');
container.bind<GetClientShipmentsUseCase>(TYPES.GetClientShipmentsUseCase).toConstantValue(getClientShipmentsUseCase);
console.log('Binding GetShipmentByIdUseCase...');
container.bind<GetShipmentByIdUseCase>(TYPES.GetShipmentByIdUseCase).toConstantValue(getShipmentByIdUseCase);
console.log('Binding CancelShipmentUseCase...');
container.bind<CancelShipmentUseCase>(TYPES.CancelShipmentUseCase).toConstantValue(cancelShipmentUseCase);

console.log('Container initialized successfully!');

export { container };
