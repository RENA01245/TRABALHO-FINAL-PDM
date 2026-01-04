import { supabase } from "../services/supabase/supabase";
import Product from "../../model/entities/product";
import { IProductRepository } from "../../model/repositories/iProductRepository";

export class SupabaseProductRepository implements IProductRepository {
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item) => ({
      id: item.id,
      name: item.nome,
      description: item.descricao,
      price: item.preco,
      imageUrl: item.imagem_url,
      createdAt: item.created_at,
    }));
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
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
      id: data.id,
      name: data.nome,
      description: data.descricao,
      price: data.preco,
      imageUrl: data.imagem_url,
      createdAt: data.created_at,
    };
  }
}
