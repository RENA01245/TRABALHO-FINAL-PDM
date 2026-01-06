import { IAuthService } from "../../src/model/services/iAuthService";
import User from "../../src/model/entities/user";
import { AuthError } from "../../src/model/errors/authError";
import { mockUser } from "../data/mockData";

/**
 * Mock do serviço de autenticação para testes
 * Simula as operações de autenticação sem depender de serviços externos
 */
export class MockAuthService implements IAuthService {
  private currentUser: User | null = null;
  private registeredUsers: Array<{ email: string; password: string; id: string }> = [];

  constructor(initialUser: User | null = null) {
    this.currentUser = initialUser;
  }
  /**
   * Realiza login de um usuário
   * @param userName - Email do usuário
   * @param password - Senha do usuário
   * @returns Usuário autenticado
   */
  async login(userName: string, password: string): Promise<User> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verifica se o usuário existe e a senha está correta
    const user = this.registeredUsers.find(
      u => u.email === userName && u.password === password
    );

    if (!user) {
      throw new AuthError('Email ou senha incorretos');
    }

    // Cria um objeto User básico para retornar
    const authUser: User = {
      uID: user.id,
      userName: userName,
      email: userName,
      telefone: null,
      pets: []
    };

    this.currentUser = authUser;
    return authUser;
  }

  /**
   * Registra um novo usuário
   * @param userName - Email do usuário
   * @param password - Senha do usuário
   * @returns Usuário criado
   */
  async signup(userName: string, password: string): Promise<User> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verifica se o email já está cadastrado
    const existingUser = this.registeredUsers.find(u => u.email === userName);
    if (existingUser) {
      throw new AuthError('Email já cadastrado');
    }

    // Gera um ID único
    const newId = `user_${Date.now()}`;

    // Registra o usuário
    this.registeredUsers.push({
      email: userName,
      password: password,
      id: newId
    });

    // Cria um objeto User básico para retornar
    const authUser: User = {
      uID: newId,
      userName: userName,
      email: userName,
      telefone: null,
      pets: []
    };

    this.currentUser = authUser;
    return authUser;
  }

  /**
   * Realiza logout do usuário atual
   */
  async logout(): Promise<void> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 100));
    this.currentUser = null;
  }

  /**
   * Observa mudanças no estado de autenticação
   * @param callback - Função chamada quando o estado muda
   * @returns Função para cancelar a observação
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // Simula chamada inicial com o usuário atual
    callback(this.currentUser);

    // Em um caso real, isso observaria mudanças no estado de autenticação
    // Para testes, podemos simular mudanças manualmente se necessário
    
    // Retorna função de unsubscribe (vazia para mocks)
    return () => {
      // No mock, não há nada para limpar
    };
  }
}
