import User from "../../model/entities/user";
import { IUserRepository } from "../../model/repositories/iUserRepository";
import { supabase } from "../services/supabase/supabase";

export class SupabaseUserRepository implements IUserRepository {
    
    async getUserByID(uID: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', uID)
            .single();

        if (error) {
            // Se o erro for "PGRST116", significa que não encontrou resultados, retornamos null
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(error.message);
        }

        if (!data) {
            return null;
        }

        return {
            uID: data.id,
            userName: data.username,
            email: data.email,
        };
    }
    
    async createUser(user: User): Promise<void> {
        const { error } = await supabase
            .from('users')
            .insert({
                id: user.uID,
                username: user.userName,
                email: user.email,
            });

        if (error) {
            throw new Error(error.message);
        }
    }
  
}