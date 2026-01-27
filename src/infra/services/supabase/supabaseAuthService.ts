import { User as SupabaseUser } from '@supabase/supabase-js';
import User from '../../../model/entities/user';
import { IAuthService } from '../../../model/services/iAuthService';
import { supabase } from '../supabase/supabase';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { AuthError } from '@/model/errors/authError';

// Necessário para o fluxo de autenticação web fechar corretamente no Android/iOS
WebBrowser.maybeCompleteAuthSession();

export class SupabaseAuthService implements IAuthService {
  
  private mapSupabaseUserToDomainUser(supabaseUser: SupabaseUser): User {
    return {
      uID: supabaseUser.id,
      email: supabaseUser.email || '',
      userName: '',
      pets: []
    };
  }

  async login(userName: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userName,
      password: password,
    });

    if (error) {
      throw new AuthError(error.message);
    }

    if (!data.user) {
      throw new AuthError('User not found after login');
    }

    return this.mapSupabaseUserToDomainUser(data.user);
  }

  async signup(userName: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: userName,
      password: password,
    });

    if (error) {
      throw new AuthError(error.message);
    }

    if (!data.user) {
      // Supabase might require email confirmation. In that case, user is created but session might be null.
      // However, usually the user object is returned.
      // If email confirmation is enabled, we might want to handle it, but for basic auth service:
      throw new AuthError('User creation failed or pending email verification');
    }

    return this.mapSupabaseUserToDomainUser(data.user);
  }

  async resetPassword(email: string): Promise<void> {
    // URL para onde o usuário será redirecionado após clicar no link do email
    // Deve ser configurada no dashboard do Supabase também
    const redirectUrl = Linking.createURL('/reset-password');
    
    // IMPORTANTE: Para funcionar em produção, a URL deve estar na whitelist do Supabase
    // Se o usuário não recebe o email, verifique:
    // 1. Logs do Supabase (Authentication -> Logs)
    // 2. Limite de emails (Rate Limit)
    // 3. Se o email existe na base de usuários
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
    });

    if (error) {
        throw new AuthError(error.message);
    }
  }

  async loginWithGoogle(): Promise<User> {
      try {
        const redirectUrl = Linking.createURL('/');
        
        // 1. Inicia o fluxo OAuth com o Supabase
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                skipBrowserRedirect: true, // Importante para controlar o fluxo manualmente
            },
        });

        if (error) throw error;
        if (!data?.url) throw new Error('Falha ao obter URL de autenticação');

        // 2. Abre o navegador para autenticação
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

        if (result.type !== 'success') {
            throw new AuthError('Login com Google cancelado.');
        }

        // 3. Extrai tokens da URL de retorno
        // O Supabase retorna os tokens no fragmento (#) da URL
        const { url } = result;
        const params = this.extractParamsFromUrl(url);
        
        // Verifica se recebeu access_token (Implicit Flow) ou code (PKCE Flow)
        // Por padrão o signInWithOAuth com Supabase retorna tokens no hash
        if (params.access_token && params.refresh_token) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: params.access_token,
                refresh_token: params.refresh_token,
            });

            if (sessionError) throw sessionError;
            if (!sessionData.user) throw new Error('Usuário não encontrado após login Google');

            return this.mapSupabaseUserToDomainUser(sessionData.user);
        }
        
        // Se por algum motivo o Supabase estiver configurado para PKCE e retornar 'code'
        // Precisaríamos trocar o code pelo token, mas o método signInWithOAuth geralmente lida com isso 
        // se não usarmos skipBrowserRedirect. Como usamos, assumimos o retorno dos tokens.
        
        // Tenta verificar se há erro na URL
        if (params.error) {
             throw new AuthError(params.error_description || params.error);
        }

        throw new AuthError('Não foi possível obter a sessão do Google. Resposta inválida.');

      } catch (error: any) {
          throw new AuthError(error.message || 'Erro no login com Google');
      }
  }

  private extractParamsFromUrl(url: string): { [key: string]: string } {
    const params: { [key: string]: string } = {};
    
    // Tenta extrair de fragmento (#) - Padrão Auth Implícito
    try {
        const fragment = url.split('#')[1];
        if (fragment) {
            fragment.split('&').forEach(param => {
                const parts = param.split('=');
                if (parts.length >= 2) {
                    const key = parts[0];
                    const value = parts.slice(1).join('='); // Reconstrói valor caso tenha =
                    if (key && value) {
                        params[key] = decodeURIComponent(value);
                    }
                }
            });
        }
    } catch (e) {
        console.warn("Erro ao fazer parse do fragmento:", e);
    }

    // Tenta extrair de query (?) - Padrão Auth Code ou Erros
    try {
        const query = url.split('?')[1];
        if (query) {
             // Se tiver fragmento depois da query, remove
             const cleanQuery = query.split('#')[0];
             cleanQuery.split('&').forEach(param => {
                const parts = param.split('=');
                if (parts.length >= 2) {
                    const key = parts[0];
                    const value = parts.slice(1).join('=');
                    if (key && value) {
                        params[key] = decodeURIComponent(value);
                    }
                }
            });
        }
    } catch (e) {
         console.warn("Erro ao fazer parse da query:", e);
    }
    
    return params;
  }



  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new AuthError(error.message);
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          callback(this.mapSupabaseUserToDomainUser(session.user));
        } else {
          callback(null);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    } catch (error: any) {
      console.error('Erro ao inicializar observador de autenticação:', error);
      callback(null);
      return () => {};
    }
  }
}
