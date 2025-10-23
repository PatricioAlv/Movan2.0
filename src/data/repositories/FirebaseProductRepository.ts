import { IProductRepository } from '@core/repositories/IProductRepository';
import { Product } from '@core/entities/Product';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { ProductMapper } from '@data/models/mappers/ProductMapper';
import { ProductModel } from '@data/models/ProductModel';
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class FirebaseProductRepository implements IProductRepository {
  private readonly PRODUCTS_PATH = 'products';

  constructor(
    @inject(TYPES.FirebaseRealtimeDataSource) private realtimeDataSource: FirebaseRealtimeDataSource
  ) {}

  async getProducts(): Promise<Product[]> {
    const data = await this.realtimeDataSource.get<{ [key: string]: ProductModel }>(
      this.PRODUCTS_PATH
    );

    if (!data) {
      return [];
    }

    return Object.entries(data).map(([id, productModel]) =>
      ProductMapper.toDomain({ ...productModel, id })
    );
  }

  async getProductById(id: string): Promise<Product | null> {
    const productModel = await this.realtimeDataSource.get<ProductModel>(
      `${this.PRODUCTS_PATH}/${id}`
    );

    if (!productModel) {
      return null;
    }

    return ProductMapper.toDomain({ ...productModel, id });
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const now = Date.now();
    const productModel: Omit<ProductModel, 'id'> = {
      ...product,
      createdAt: now,
      updatedAt: now,
    };

    const id = await this.realtimeDataSource.create(this.PRODUCTS_PATH, productModel);

    return ProductMapper.toDomain({ ...productModel, id });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const updates: Partial<ProductModel> = {
      ...product,
      updatedAt: Date.now(),
    };

    await this.realtimeDataSource.update(`${this.PRODUCTS_PATH}/${id}`, updates);

    const updatedProduct = await this.getProductById(id);
    
    if (!updatedProduct) {
      throw new Error('Product not found after update');
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.realtimeDataSource.delete(`${this.PRODUCTS_PATH}/${id}`);
  }

  listenToProducts(callback: (products: Product[]) => void): () => void {
    return this.realtimeDataSource.listen(this.PRODUCTS_PATH, (snapshot) => {
      const data = snapshot.val();
      
      if (!data) {
        callback([]);
        return;
      }

      const products = Object.entries(data).map(([id, productModel]) =>
        ProductMapper.toDomain({ ...(productModel as ProductModel), id })
      );

      callback(products);
    });
  }
}
