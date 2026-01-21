import { supabase } from "../services/supabase/supabase";
import { PetAttendance, PetStatus } from "../../model/entities/petAttendance";
import { ITrackingRepository } from "../../model/repositories/iTrackingRepository";

export class SupabaseTrackingRepository implements ITrackingRepository {
  
  async getTrackingByClientId(clientId: string): Promise<PetAttendance[]> {
    console.log(`[SupabaseTrackingRepository] Buscando atendimentos para cliente: ${clientId}`);
    // Busca atendimentos onde o pet pertence ao cliente logado
    // Utilizamos o join (inner join) com a tabela de pets para filtrar pelo tutor
    const { data, error } = await supabase
      .from('atendimentos')
      .select(`
        atendimento_id,
        status,
        data_solicitacao,
        pets!inner (
          pet_id,
          nome,
          cliente_id
        )
      `)
      .eq('pets.cliente_id', clientId)
      .neq('status', 'Finalizado'); // Opcional: mostrar apenas ativos

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item: any) => ({
        id: item.atendimento_id,
        petId: item.pets.pet_id,
        petName: item.pets.nome,
        serviceName: 'Serviço Agendado', // Placeholder pois servico_nome não existe na tabela
        status: item.status as PetStatus,
        lastUpdate: new Date(item.data_solicitacao), // Usando data_solicitacao como lastUpdate
        clientId: clientId
    }));
  }

  async updateStatusByPetMatricula(matricula: string, status: PetStatus): Promise<void> {
    // 1. Primeiro buscamos o pet pela matrícula para obter o ID real
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('pet_id')
      .eq('matricula', matricula)
      .single();

    if (petError || !pet) {
      throw new Error("Pet com esta matrícula não encontrado.");
    }

    // 2. Atualizamos o status do atendimento mais recente deste pet
    const { error } = await supabase
      .from('atendimentos')
      .update({ 
        status: status
        // updated_at removido pois não existe na tabela
      })
      .eq('pet_id', pet.pet_id)
      // Garante que estamos editando o atendimento que não foi concluído ainda
      .neq('status', 'Finalizado'); 

    if (error) {
      throw new Error(error.message);
    }
  }
}