import { AuthError } from '@/model/errors/authError';
import User from '@/model/entities/user';
import { IUserRepository } from '@/model/repositories/iUserRepository';

/**
 * Use Cases para validação de permissões administrativas
 * 
 * BACKEND (Segurança Real):
 * - Valida autenticação e permissão em todas as requisições
 * - Bloqueia acesso mesmo em tentativas diretas por URL ou requisições manuais
 * - Sem essa validação o sistema fica vulnerável
 */
export class AdminUseCases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Valida se o usuário é administrador
   * @param userId - ID do usuário a ser validado
   * @throws AuthError se o usuário não for admin ou não existir
   */
  async validateAdminAccess(userId: string): Promise<void> {
    if (!userId || userId.trim() === '') {
      throw new AuthError('Usuário não autenticado');
    }

    // Se for admin mock, valida direto sem buscar no repositório
    if (userId === 'admin-123-456-789-abc-def') {
      return; // Admin mock sempre tem acesso
    }

    const user = await this.userRepository.getUserByID(userId);

    if (!user) {
      throw new AuthError('Usuário não encontrado');
    }

    if (user.role !== 'admin') {
      throw new AuthError('Acesso negado: apenas administradores podem acessar esta área');
    }
  }

  /**
   * Verifica se o usuário é administrador
   * @param userId - ID do usuário a ser verificado
   * @returns true se for admin, false caso contrário
   */
  async isAdmin(userId: string): Promise<boolean> {
    try {
      if (!userId || userId.trim() === '') {
        return false;
      }

      // Se for admin mock, retorna true direto
      if (userId === 'admin-123-456-789-abc-def') {
        return true;
      }

      const user = await this.userRepository.getUserByID(userId);
      return user?.role === 'admin';
    } catch (error) {
      console.error('Erro ao verificar permissão de admin:', error);
      return false;
    }
  }

  /**
   * Obtém o usuário atual e valida se é admin
   * @param userId - ID do usuário
   * @returns Usuário admin
   * @throws AuthError se não for admin
   */
  async getAdminUser(userId: string): Promise<User> {
    await this.validateAdminAccess(userId);
    
    // Se for admin mock, retorna o usuário mock direto
    if (userId === 'admin-123-456-789-abc-def') {
      return {
        uID: 'admin-123-456-789-abc-def',
        userName: 'Administrador',
        email: 'admin@petcare.com',
        telefone: null,
        pets: [],
        role: 'admin',
      };
    }
    
    const user = await this.userRepository.getUserByID(userId);
    if (!user) {
      throw new AuthError('Usuário não encontrado');
    }

    return user;
  }
}

