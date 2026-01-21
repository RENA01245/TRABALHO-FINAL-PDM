import Product from "../../model/entities/product";
import { IProductRepository } from "../../model/repositories/iProductRepository";

export interface IProductUseCases {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
}
