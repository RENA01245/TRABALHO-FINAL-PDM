import { IProductRepository } from "../../src/model/repositories/iProductRepository";
import Product from "../../src/model/entities/product";
import { mockProducts } from "../data/mockData";
import { RepositoryError } from "../../src/model/errors/repositoryError";
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock do repositório de produtos para testes
 * Simula as operações de banco de dados com dados mockados
 */
export class MockProductRepository implements IProductRepository {
  private products: Product[] = [...mockProducts];

  /**
   * Busca todos os produtos disponíveis
   * @returns Lista de todos os produtos
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      return [...this.products];
    } catch (error) {
      throw new RepositoryError('Falha ao obter todos os produtos');
    }
  }

  /**
   * Busca um produto pelo ID
   * @param id - ID do produto
   * @returns Produto encontrado ou null
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      if (!id || id.trim() === '') {
        throw new RepositoryError('ID do produto inválido');
      }
      
      const product = this.products.find(p => p.id === id) || null;
      return product;
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError('Falha ao obter produto por ID');
    }
  }

  async createProduct(data: { name: string; price: number; description?: string | null; imageUrl?: string | null }): Promise<Product> {
    try {
      const newProduct: Product = {
        id: uuidv4(),
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        imageUrl: data.imageUrl ?? null,
        createdAt: new Date().toISOString(),
      };
      this.products.push(newProduct);
      return newProduct;
    } catch (error) {
      throw new RepositoryError('Falha ao criar produto');
    }
  }

  async updateProduct(id: string, data: { name?: string; price?: number; description?: string | null; imageUrl?: string | null }): Promise<Product> {
    try {
      const idx = this.products.findIndex(p => p.id === id);
      if (idx === -1) {
        throw new RepositoryError('Produto não encontrado');
      }
      const existing = this.products[idx];
      const updated: Product = {
        ...existing,
        name: data.name ?? existing.name,
        price: data.price ?? existing.price,
        description: data.description !== undefined ? data.description : existing.description,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
      };
      this.products[idx] = updated;
      return updated;
    } catch (error) {
      if (error instanceof RepositoryError) throw error;
      throw new RepositoryError('Falha ao atualizar produto');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const idx = this.products.findIndex(p => p.id === id);
      if (idx === -1) {
        throw new RepositoryError('Produto não encontrado');
      }
      this.products.splice(idx, 1);
    } catch (error) {
      if (error instanceof RepositoryError) throw error;
      throw new RepositoryError('Falha ao deletar produto');
    }
  }
}
