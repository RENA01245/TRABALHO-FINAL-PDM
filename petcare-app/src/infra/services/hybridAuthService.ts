import User from '../../model/entities/user';
import { IAuthService } from '../../model/services/iAuthService';
import { SupabaseAuthService } from './supabase/supabaseAuthService';
import Pet from '../../model/entities/pet';

/**
 * Serviço de autenticação híbrido
 * 
 * - Usa MOCK apenas para login de admin (admin@petcare.com / admin123)
 * - Usa Supabase para todos os outros usuários
 * 
 * Isso permite testar a funcionalidade admin sem precisar criar usuário admin no Supabase,
 * mas mantém o Supabase funcionando para todas as outras funcionalidades.
 */
export class HybridAuthService implements IAuthService {
  private supabaseAuthService: SupabaseAuthService;
  private adminMockUser: User | null = null;
  private authStateCallbacks: Array<(user: User | null) => void> = [];

  // Credenciais do admin mock
  private readonly ADMIN_EMAIL = 'admin@petcare.com';
  private readonly ADMIN_PASSWORD = 'admin123';
  private readonly ADMIN_ID = 'admin-123-456-789-abc-def';

  // Pet mock do admin
  private readonly ADMIN_PET: Pet = {
    id: 'admin-pet-001-abc-def-123-456',
    clientId: this.ADMIN_ID,
    name: 'Max',
    breed: 'Golden Retriever',
    age: 4,
    observations: 'Pet do administrador - muito carinhoso',
  };

  constructor() {
    this.supabaseAuthService = new SupabaseAuthService();
  }

  private notifyAuthStateChange(user: User | null) {
    this.authStateCallbacks.forEach(callback => callback(user));
  }

  async login(userName: string, password: string): Promise<User> {
    // Se for login de admin, usa mock
    if (userName === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      const adminUser: User = {
        uID: this.ADMIN_ID,
        userName: 'Administrador',
        email: this.ADMIN_EMAIL,
        telefone: null,
        pets: [this.ADMIN_PET], // Inclui o pet mock
        role: 'admin',
      };

      this.adminMockUser = adminUser;
      // Notifica os listeners sobre a mudança de estado
      this.notifyAuthStateChange(adminUser);
      return adminUser;
    }

    // Para todos os outros usuários, usa Supabase
    return await this.supabaseAuthService.login(userName, password);
  }

  async signup(userName: string, password: string): Promise<User> {
    // Signup sempre usa Supabase (não criamos admin via signup)
    return await this.supabaseAuthService.signup(userName, password);
  }

  async logout(): Promise<void> {
    // Limpa o admin mock se estiver logado
    if (this.adminMockUser) {
      this.adminMockUser = null;
      // Notifica os listeners sobre o logout
      this.notifyAuthStateChange(null);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    // Para outros usuários, usa Supabase
    return await this.supabaseAuthService.logout();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // Adiciona o callback à lista de listeners
    this.authStateCallbacks.push(callback);

    // Se há admin mock logado, chama o callback imediatamente
    if (this.adminMockUser) {
      callback(this.adminMockUser);
    }

    // Para outros usuários, também observa mudanças no Supabase
    const supabaseUnsubscribe = this.supabaseAuthService.onAuthStateChanged((supabaseUser) => {
      // Só notifica se não for admin mock (admin mock tem prioridade)
      if (!this.adminMockUser) {
        callback(supabaseUser);
      }
    });

    // Retorna função de unsubscribe
    return () => {
      // Remove o callback da lista
      this.authStateCallbacks = this.authStateCallbacks.filter(cb => cb !== callback);
      // Cancela a subscription do Supabase
      if (typeof supabaseUnsubscribe === 'function') {
        supabaseUnsubscribe();
      }
    };
  }
}

