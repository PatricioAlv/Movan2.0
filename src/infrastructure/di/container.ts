import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Repositories
import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { IProductRepository } from '@core/repositories/IProductRepository';
import { FirebaseAuthRepository } from '@data/repositories/FirebaseAuthRepository';
import { FirebaseProductRepository } from '@data/repositories/FirebaseProductRepository';

// DataSources
import { FirebaseAuthDataSource } from '@data/datasources/remote/FirebaseAuthDataSource';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { AsyncStorageDataSource } from '@data/datasources/local/AsyncStorageDataSource';
import { SecureStorageDataSource } from '@data/datasources/local/SecureStorageDataSource';

// Use Cases
import { LoginUseCase } from '@core/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '@core/usecases/auth/RegisterUseCase';
import { LogoutUseCase } from '@core/usecases/auth/LogoutUseCase';
import { GetProductsUseCase } from '@core/usecases/products/GetProductsUseCase';
import { CreateProductUseCase } from '@core/usecases/products/CreateProductUseCase';

const container = new Container();

// Bind DataSources
container.bind(TYPES.FirebaseAuthDataSource).to(FirebaseAuthDataSource).inSingletonScope();
container.bind(TYPES.FirebaseRealtimeDataSource).to(FirebaseRealtimeDataSource).inSingletonScope();
container.bind(TYPES.AsyncStorageDataSource).to(AsyncStorageDataSource).inSingletonScope();
container.bind(TYPES.SecureStorageDataSource).to(SecureStorageDataSource).inSingletonScope();

// Bind Repositories
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(FirebaseAuthRepository).inSingletonScope();
container.bind<IProductRepository>(TYPES.IProductRepository).to(FirebaseProductRepository).inSingletonScope();

// Bind Use Cases
container.bind(TYPES.LoginUseCase).to(LoginUseCase);
container.bind(TYPES.RegisterUseCase).to(RegisterUseCase);
container.bind(TYPES.LogoutUseCase).to(LogoutUseCase);
container.bind(TYPES.GetProductsUseCase).to(GetProductsUseCase);
container.bind(TYPES.CreateProductUseCase).to(CreateProductUseCase);

export { container };
