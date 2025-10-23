export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  createdAt: number;
  updatedAt: number;
}
