import { IUserRepository } from "../../src/model/repositories/iUserRepository";
import User from "../../src/model/entities/user";
import { mockUser, mockPets } from "../data/mockData";
import { RepositoryError } from "../../src/model/errors/repositoryError";

/**
 * Mock do repositório de usuários para testes
 * Simula as operações de banco de dados com dados mockados
 */
export class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  /**
   * Cria um novo usuário no sistema
   * @param user - Dados do usuário a ser criado
   */
  async createUser(user: User): Promise<void> {
    try {
      // Simula validação: verifica se o email já existe
      const existingUser = this.users.find(u => u.email === user.email);
      if (existingUser) {
        throw new RepositoryError('Email já cadastrado');
      }
      
      // Adiciona o usuário à lista
      this.users.push(user);
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError('Falha ao criar usuário');
    }
  }

  /**
   * Busca um usuário pelo ID
   * @param uID - ID do usuário
   * @returns Usuário encontrado ou null
   */
  async getUserByID(uID: string): Promise<User | null> {
    try {
      if (!uID || uID.trim() === '') {
        throw new RepositoryError('ID do usuário inválido');
      }
      
      const user = this.users.find(u => u.uID === uID) || null;
      return user;
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError('Falha ao buscar usuário por ID');
    }
  }
}
