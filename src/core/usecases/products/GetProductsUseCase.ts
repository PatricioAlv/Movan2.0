import { IProductRepository } from '@core/repositories/IProductRepository';
import { Product } from '@core/entities/Product';
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class GetProductsUseCase {
  constructor(
    @inject(TYPES.IProductRepository) private productRepository: IProductRepository
  ) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.getProducts();
  }
}
