import Product from "../../model/entities/product";
import { IProductRepository } from "../../model/repositories/iProductRepository";
import { IProductUseCases } from "./iProductUseCases";

export class ProductUseCases implements IProductUseCases {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.getAllProducts();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.getProductById(id);
  }
}
