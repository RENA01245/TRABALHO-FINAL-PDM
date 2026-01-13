import { supabase } from "../services/supabase/supabase";
import { PetAttendance, PetStatus } from "../../model/entities/petAttendance";
import { ITrackingRepository } from "../../model/repositories/iTrackingRepository";

export class SupabaseTrackingRepository implements ITrackingRepository {
  
  async getTrackingByClientId(clientId: string): Promise<PetAttendance[]> {
    // Busca atendimentos onde o pet pertence ao cliente logado
    // Utilizamos o join (inner join) com a tabela de pets para filtrar pelo tutor
    const { data, error } = await supabase
      .from('atendimentos')
      .select(`
        id,
        status,
        updated_at,
        servico_nome,
        pets!inner (
          id,
          nome,
          matricula,
          client_id
        )
      `)
      .eq('pets.client_id', clientId)
      .neq('status', 'Finalizado'); // Opcional: mostrar apenas ativos

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item: any) => ({
        id: item.id,
        petId: item.pets.id,
        petName: item.pets.nome,
        serviceName: item.servico_nome,
        status: item.status as PetStatus,
        lastUpdate: new Date(item.updated_at),
        clientId: clientId
    }));
  }

  async updateStatusByPetMatricula(matricula: string, status: PetStatus): Promise<void> {
    // 1. Primeiro buscamos o pet pela matrícula para obter o ID real
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('id')
      .eq('matricula', matricula)
      .single();

    if (petError || !pet) {
      throw new Error("Pet com esta matrícula não encontrado.");
    }

    // 2. Atualizamos o status do atendimento mais recente deste pet
    const { error } = await supabase
      .from('atendimentos')
      .update({ 
        status: status,
        updated_at: new Date().toISOString() 
      })
      .eq('pet_id', pet.id)
      // Garante que estamos editando o atendimento que não foi concluído ainda
      .neq('status', 'Finalizado'); 

    if (error) {
      throw new Error(error.message);
    }
  }
}