import { supabase } from "../services/supabase/supabase";
import { PetAttendance, PetStatus } from "../../model/entities/petAttendance";
import { ITrackingRepository } from "../../model/repositories/iTrackingRepository";

export class SupabaseTrackingRepository implements ITrackingRepository {
  
  async getTrackingByClientId(clientId: string): Promise<PetAttendance[]> {
    console.log(`[SupabaseTrackingRepository] Buscando atendimentos para cliente: ${clientId}`);
    // Busca atendimentos onde o pet pertence ao cliente logado
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
      .neq('status', 'Finalizado');

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item: any) => ({
        id: item.atendimento_id,
        petId: item.pets.pet_id,
        petName: item.pets.nome,
        serviceName: 'Serviço Agendado',
        status: item.status as PetStatus,
        lastUpdate: new Date(item.data_solicitacao),
        clientId: clientId
    }));
  }

  async updateStatusByPetMatricula(matricula: string, status: PetStatus): Promise<void> {
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('pet_id')
      .eq('matricula', matricula)
      .single();

    if (petError || !pet) {
      throw new Error("Pet com esta matrícula não encontrado.");
    }

    const { error } = await supabase
      .from('atendimentos')
      .update({ status: status })
      .eq('pet_id', pet.pet_id)
      .neq('status', 'Finalizado'); 

    if (error) {
      throw new Error(error.message);
    }
  }
}
