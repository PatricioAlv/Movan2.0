import { User } from '@core/entities/User';
import { UserModel } from '../UserModel';

export class UserMapper {
  static toDomain(model: UserModel): User {
    return {
      id: model.id,
      email: model.email,
      name: model.name,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
    };
  }

  static toModel(entity: User): UserModel {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      createdAt: entity.createdAt.getTime(),
      updatedAt: entity.updatedAt.getTime(),
    };
  }
}
