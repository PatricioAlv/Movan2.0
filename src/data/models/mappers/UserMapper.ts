import { User } from '@core/entities/User';
import { UserModel } from '../UserModel';

export class UserMapper {
  static toDomain(model: UserModel): User {
    return {
      id: model.id,
      email: model.email,
      name: model.name,
      role: model.role,
      phone: model.phone,
      averageRating: model.averageRating,
      totalRatings: model.totalRatings,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
    };
  }

  static toModel(entity: User): UserModel {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      role: entity.role,
      phone: entity.phone,
      averageRating: entity.averageRating,
      totalRatings: entity.totalRatings,
      createdAt: entity.createdAt.getTime(),
      updatedAt: entity.updatedAt.getTime(),
    };
  }
}
