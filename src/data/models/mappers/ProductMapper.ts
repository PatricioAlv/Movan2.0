import { Product } from '@core/entities/Product';
import { ProductModel } from '../ProductModel';

export class ProductMapper {
  static toDomain(model: ProductModel): Product {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      price: model.price,
      imageUrl: model.imageUrl,
      category: model.category,
      stock: model.stock,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
    };
  }

  static toModel(entity: Product): ProductModel {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      imageUrl: entity.imageUrl,
      category: entity.category,
      stock: entity.stock,
      createdAt: entity.createdAt.getTime(),
      updatedAt: entity.updatedAt.getTime(),
    };
  }
}
