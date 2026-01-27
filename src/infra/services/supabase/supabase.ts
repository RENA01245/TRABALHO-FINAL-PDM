import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthError } from '@/model/errors/authError';

let EXPO_PUBLIC_SUPABASE_URL = 'https://zbqqpclvfnyqfhbfyyem.supabase.co';
let EXPO_PUBLIC_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicXFwY2x2Zm55cWZoYmZ5eWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDg3NzksImV4cCI6MjA4MTU4NDc3OX0.z0jeEJr0N9ugaKm7_s_r3y10c3poU3J_F02lvgg-Zco';

const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase URL ou Anon Key não encontradas nas variáveis de ambiente. Verifique o arquivo .env ou as variáveis de ambiente do build.'
  );
}

let supabaseInstance: SupabaseClient | null = null;

function createSupabaseClientSafely(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new AuthError(
      'Não foi possível conectar ao servidor. As configurações do servidor não estão definidas. Entre em contato com o suporte.'
    );
  }

  return createClient(supabaseUrl as string, supabaseAnonKey as string);
}

function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClientSafely();
  }
  return supabaseInstance;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[prop];
  },
});
