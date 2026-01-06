import { IProductRepository } from "../../src/model/repositories/iProductRepository";
import Product from "../../src/model/entities/product";
import { mockProducts } from "../data/mockData";
import { RepositoryError } from "../../src/model/errors/repositoryError";

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
}
