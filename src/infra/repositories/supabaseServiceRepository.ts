import { supabase } from "../services/supabase/supabase";
import Service from "../../model/entities/service";
import { IServiceRepository } from "../../model/repositories/iServiceRepository";

export class SupabaseServiceRepository implements IServiceRepository {
  async getAllServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('servicos')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item) => ({
      id: item.servico_id,
      name: item.nome,
      description: item.descricao,
      price: item.preco,
      estimatedDuration: item.duracao_estimada,
      type: item.tipo,
    }));
  }

  async getServiceById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('servico_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.servico_id,
      name: data.nome,
      description: data.descricao,
      price: data.preco,
      estimatedDuration: data.duracao_estimada,
      type: data.tipo,
    };
  }
}
