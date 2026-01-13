import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IAuthService, AuthCredentials } from "../../../model/services/iAuthService";
import User from "../../../model/entities/user";
import { InvalidCredentialsError, AuthNetworkError, UserAlreadyExistsError } from "../../../model/errors/authErrors";
import Constants from "expo-constants";

export class SupabaseAuthService implements IAuthService {
  private client: SupabaseClient;

  constructor() {
    // ler de app.json extra via expo-constants em vez de process.env, se for o seu caso
    const url = (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_SUPABASE_URL;
    const key = (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars not set (app.json.extra)");
    this.client = createClient(url, key);
  }

  async login(credentials: AuthCredentials): Promise<User> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: credentials.userName,
        password: credentials.password,
      });
      if (error || !data.session) throw new InvalidCredentialsError();
      const supUser = data.user;
      return {
        id: supUser.id,
        userName: supUser.email || credentials.userName,
        email: supUser.email,
      };
    } catch (err) {
      if (err instanceof InvalidCredentialsError) throw err;
      throw new AuthNetworkError();
    }
  }

  async signup(credentials: AuthCredentials): Promise<User> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: credentials.userName,
        password: credentials.password,
      });
      if (error) {
        // mapear erros específicos se possível
        throw new UserAlreadyExistsError();
      }
      const supUser = data.user!;
      return {
        id: supUser.id,
        userName: supUser.email || credentials.userName,
        email: supUser.email,
      };
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) throw err;
      throw new AuthNetworkError();
    }
  }

  async logout(): Promise<void> {
    await this.client.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.client.auth.getUser();
    const u = data.user;
    if (!u) return null;
    return { id: u.id, userName: u.email || "", email: u.email };
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const { data: sub } = this.client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ? { id: session.user.id, userName: session.user.email || "", email: session.user.email } : null;
      callback(user);
    });
    return () => sub.subscription.unsubscribe();
  }
}

export default SupabaseAuthService;