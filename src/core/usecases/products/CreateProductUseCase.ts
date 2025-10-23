import { IProductRepository } from '@core/repositories/IProductRepository';
import { Product } from '@core/entities/Product';
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject(TYPES.IProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    if (!product.name || !product.price) {
      throw new Error('Name and price are required');
    }

    if (product.price < 0) {
      throw new Error('Price must be positive');
    }

    if (product.stock < 0) {
      throw new Error('Stock must be positive');
    }

    return await this.productRepository.createProduct(product);
  }
}
