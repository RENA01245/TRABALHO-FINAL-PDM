import { RepositoryError } from "@/model/errors/repositoryError";
import User from "../../model/entities/user";
import { IUserRepository } from "../../model/repositories/iUserRepository";
import { supabase } from "../services/supabase/supabase";

export class SupabaseUserRepository implements IUserRepository {
    
    async getUserByID(uID: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select(`
                *,
                pets (*)
            `)
            .eq('id', uID)
            .single();

        if (error) {
            // Se o erro for "PGRST116", significa que não encontrou resultados, retornamos null
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new RepositoryError(error.message);
        }

        if (!data) {
            return null;
        }

        return {
            uID: data.id,
            userName: data.username,
            email: data.email,
            telefone: data.telefone,
            createdAt: data.created_at ? new Date(data.created_at) : undefined,
            pets: data.pets ? data.pets.map((p: any) => ({
                id: p.pet_id,
                clientId: p.cliente_id,
                name: p.nome,
                breed: p.raca,
                age: p.idade,
                observations: p.observacoes
            })) : []
        };
    }
    
    async createUser(user: User): Promise<void> {
        const { error } = await supabase
            .from('users')
            .insert({
                id: user.uID,
                username: user.userName,
                email: user.email,
                telefone: user.telefone,
            });

        if (error) {
            throw new RepositoryError(error.message);
        }
    }

    async updateUser(user: User): Promise<void> {
        const { error } = await supabase
            .from('users')
            .update({
                username: user.userName,
                telefone: user.telefone,
            })
            .eq('id', user.uID);

        if (error) {
            throw new RepositoryError(error.message);
        }
    }
  
}