import Pet from '../../model/entities/pet';
import { IPetRepository } from '../../model/repositories/iPetRepository';
import { SupabasePetRepository } from './supabasePetRepository';

/**
 * Repositório híbrido de pets
 * - Retorna pet mock para admin mock
 * - Usa Supabase para outros usuários
 */
export class HybridPetRepository implements IPetRepository {
  private supabasePetRepository: SupabasePetRepository;
  private readonly ADMIN_ID = 'admin-123-456-789-abc-def';
  private readonly ADMIN_PET: Pet = {
    id: 'admin-pet-001-abc-def-123-456',
    clientId: this.ADMIN_ID,
    name: 'Max',
    breed: 'Golden Retriever',
    age: 4,
    observations: 'Pet do administrador - muito carinhoso',
  };

  constructor() {
    this.supabasePetRepository = new SupabasePetRepository();
  }

  async getAllPetsByClientId(clientId: string): Promise<Pet[]> {
    console.log('🐾 [HybridPetRepository] Buscando pets para clientId:', clientId);
    console.log('🐾 [HybridPetRepository] ADMIN_ID:', this.ADMIN_ID);
    console.log('🐾 [HybridPetRepository] É admin?', clientId === this.ADMIN_ID);
    
    // Se for admin mock, retorna o pet mock
    if (clientId === this.ADMIN_ID) {
      console.log('✅ [HybridPetRepository] Retornando pet mock do admin:', this.ADMIN_PET.name);
      return [this.ADMIN_PET];
    }

    // Para outros usuários, usa Supabase
    console.log('🗄️ [HybridPetRepository] Buscando no Supabase para clientId:', clientId);
    return await this.supabasePetRepository.getAllPetsByClientId(clientId);
  }

  async getPetById(id: string): Promise<Pet | null> {
    // Se for o pet do admin mock, retorna ele
    if (id === this.ADMIN_PET.id) {
      return this.ADMIN_PET;
    }

    // Para outros pets, usa Supabase
    return await this.supabasePetRepository.getPetById(id);
  }
}

