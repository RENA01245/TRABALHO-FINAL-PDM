import Product from "../../model/entities/product";
import { IProductRepository } from "../../model/repositories/iProductRepository";

export interface IProductUseCases {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;

  createProduct(data: { name: string; price: number; description?: string | null; imageUrl?: string | null }): Promise<Product>;
  updateProduct(id: string, data: { name?: string; price?: number; description?: string | null; imageUrl?: string | null }): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}
