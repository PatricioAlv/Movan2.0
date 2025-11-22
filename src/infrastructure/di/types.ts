export const TYPES = {
  // Repositories
  IAuthRepository: Symbol.for('IAuthRepository'),
  IProductRepository: Symbol.for('IProductRepository'),
  IStorageRepository: Symbol.for('IStorageRepository'),
  IShipmentRepository: Symbol.for('IShipmentRepository'),

  // DataSources
  FirebaseAuthDataSource: Symbol.for('FirebaseAuthDataSource'),
  FirebaseRealtimeDataSource: Symbol.for('FirebaseRealtimeDataSource'),
  FirebaseShipmentDataSource: Symbol.for('FirebaseShipmentDataSource'),
  AsyncStorageDataSource: Symbol.for('AsyncStorageDataSource'),
  SecureStorageDataSource: Symbol.for('SecureStorageDataSource'),

  // Use Cases
  LoginUseCase: Symbol.for('LoginUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  GetProductsUseCase: Symbol.for('GetProductsUseCase'),
  CreateProductUseCase: Symbol.for('CreateProductUseCase'),
  CreateShipmentUseCase: Symbol.for('CreateShipmentUseCase'),
  GetClientShipmentsUseCase: Symbol.for('GetClientShipmentsUseCase'),
  GetShipmentByIdUseCase: Symbol.for('GetShipmentByIdUseCase'),
  CancelShipmentUseCase: Symbol.for('CancelShipmentUseCase'),
};
