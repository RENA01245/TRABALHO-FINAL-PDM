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

    return data.map((item: any) => ({
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

  async createProduct(data: { name: string; price: number; description?: string | null; imageUrl?: string | null }): Promise<Product> {
    const { data: created, error } = await supabase
      .from('produtos')
      .insert({
        nome: data.name,
        descricao: data.description ?? null,
        preco: data.price,
        imagem_url: data.imageUrl ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: created.id,
      name: created.nome,
      description: created.descricao,
      price: created.preco,
      imageUrl: created.imagem_url,
      createdAt: created.created_at,
    };
  }

  async updateProduct(id: string, data: { name?: string; price?: number; description?: string | null; imageUrl?: string | null }): Promise<Product> {
    const payload: any = {};
    if (data.name !== undefined) payload.nome = data.name;
    if (data.description !== undefined) payload.descricao = data.description;
    if (data.price !== undefined) payload.preco = data.price;
    if (data.imageUrl !== undefined) payload.imagem_url = data.imageUrl;

    const { data: updated, error } = await supabase
      .from('produtos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: updated.id,
      name: updated.nome,
      description: updated.descricao,
      price: updated.preco,
      imageUrl: updated.imagem_url,
      createdAt: updated.created_at,
    };
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
