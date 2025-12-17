import { User as SupabaseUser } from '@supabase/supabase-js';
import User from '../../../model/entities/user';
import { IAuthService } from '../../../model/services/iAuthService';
import { supabase } from '../supabase/supabase';

export class SupabaseAuthService implements IAuthService {
  
  private mapSupabaseUserToDomainUser(supabaseUser: SupabaseUser): User {
    return {
      uID: supabaseUser.id,
      email: supabaseUser.email || '',
      userName: ''
    };
  }

  async login(userName: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userName,
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('User not found after login');
    }

    return this.mapSupabaseUserToDomainUser(data.user);
  }

  async signup(userName: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: userName,
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      // Supabase might require email confirmation. In that case, user is created but session might be null.
      // However, usually the user object is returned.
      // If email confirmation is enabled, we might want to handle it, but for basic auth service:
      throw new Error('User creation failed or pending email verification');
    }

    return this.mapSupabaseUserToDomainUser(data.user);
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): void {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback(this.mapSupabaseUserToDomainUser(session.user));
      } else {
        callback(null);
      }
    });
  }
}