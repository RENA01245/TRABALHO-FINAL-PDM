import Product from "../../model/entities/product";
import { IProductRepository } from "../../model/repositories/iProductRepository";
import { IProductUseCases } from "./iProductUseCases";
import { ValidationError } from "../../model/errors/validationError";

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

  async createProduct(data: { name: string; price: number; description?: string | null; imageUrl?: string | null }): Promise<Product> {
    if (!data.name || data.name.trim() === "") {
      throw new ValidationError("Nome do produto é obrigatório");
    }
    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new ValidationError("Preço inválido");
    }

    return this.productRepository.createProduct({
      name: data.name.trim(),
      price: data.price,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
    });
  }

  async updateProduct(id: string, data: { name?: string; price?: number; description?: string | null; imageUrl?: string | null }): Promise<Product> {
    if (data.name !== undefined && data.name.trim() === "") {
      throw new ValidationError("Nome do produto não pode ser vazio");
    }
    if (data.price !== undefined && (typeof data.price !== 'number' || data.price <= 0)) {
      throw new ValidationError("Preço inválido");
    }

    return this.productRepository.updateProduct(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new ValidationError('ID inválido');
    }
    return this.productRepository.deleteProduct(id);
  }
}
