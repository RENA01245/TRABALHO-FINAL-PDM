import { supabase } from "../services/supabase/supabase";
import Pet from "../../model/entities/pet";
import { IPetRepository } from "../../model/repositories/iPetRepository";

export class SupabasePetRepository implements IPetRepository {
  async getAllPetsByClientId(clientId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('cliente_id', clientId);

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item) => ({
      id: item.pet_id,
      clientId: item.cliente_id,
      name: item.nome,
      breed: item.raca,
      age: item.idade,
      observations: item.observacoes,
      imageUrl: item.foto_url, // Mapeando do banco (foto_url) para entidade (imageUrl)
    }));
  }

  async getPetById(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('pet_id', id)
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
      id: data.pet_id,
      clientId: data.cliente_id,
      name: data.nome,
      breed: data.raca,
      age: data.idade,
      observations: data.observacoes,
      imageUrl: data.foto_url,
    };
  }

  async createPet(pet: Pet): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .insert({
        cliente_id: pet.clientId,
        nome: pet.name,
        raca: pet.breed,
        idade: pet.age,
        observacoes: pet.observations,
        foto_url: pet.imageUrl,
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  async updatePet(pet: Pet): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .update({
        nome: pet.name,
        raca: pet.breed,
        idade: pet.age,
        observacoes: pet.observations,
        foto_url: pet.imageUrl,
      })
      .eq('pet_id', pet.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async deletePet(id: string): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('pet_id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
