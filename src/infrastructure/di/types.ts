export const TYPES = {
  // Repositories
  IAuthRepository: Symbol.for('IAuthRepository'),
  IProductRepository: Symbol.for('IProductRepository'),
  IStorageRepository: Symbol.for('IStorageRepository'),
  IShipmentRepository: Symbol.for('IShipmentRepository'),
  UserRepository: Symbol.for('UserRepository'),
  RatingRepository: Symbol.for('RatingRepository'),

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
  GetAvailableShipmentsUseCase: Symbol.for('GetAvailableShipmentsUseCase'),
  GetDriverShipmentsUseCase: Symbol.for('GetDriverShipmentsUseCase'),
  AcceptShipmentUseCase: Symbol.for('AcceptShipmentUseCase'),
  UpdateShipmentStatusUseCase: Symbol.for('UpdateShipmentStatusUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  CreateRatingUseCase: Symbol.for('CreateRatingUseCase'),
  GetUserRatingsUseCase: Symbol.for('GetUserRatingsUseCase'),
  GetUserAverageRatingUseCase: Symbol.for('GetUserAverageRatingUseCase'),
  HasUserRatedShipmentUseCase: Symbol.for('HasUserRatedShipmentUseCase'),
};
