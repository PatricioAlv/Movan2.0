export const TYPES = {
  // Repositories
  IAuthRepository: Symbol.for('IAuthRepository'),
  IProductRepository: Symbol.for('IProductRepository'),
  IStorageRepository: Symbol.for('IStorageRepository'),

  // DataSources
  FirebaseAuthDataSource: Symbol.for('FirebaseAuthDataSource'),
  FirebaseRealtimeDataSource: Symbol.for('FirebaseRealtimeDataSource'),
  AsyncStorageDataSource: Symbol.for('AsyncStorageDataSource'),
  SecureStorageDataSource: Symbol.for('SecureStorageDataSource'),

  // Use Cases
  LoginUseCase: Symbol.for('LoginUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  GetProductsUseCase: Symbol.for('GetProductsUseCase'),
  CreateProductUseCase: Symbol.for('CreateProductUseCase'),
};
