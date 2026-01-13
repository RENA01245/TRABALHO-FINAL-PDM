import User from "../entities/user";

export interface AuthCredentials {
  userName: string;
  password: string;
}

export interface IAuthService {
  /**
   * Realiza login com credenciais. Deve lançar erros de domínio em caso de falha
   * (por exemplo: InvalidCredentialsError em model/errors).
   */
  login(credentials: AuthCredentials): Promise<User>;

  /**
   * Registra um novo usuário. Deve validar duplicidade e lançar erros específicos.
   */
  signup(credentials: AuthCredentials): Promise<User>;

  /**
   * Faz logout do usuário atual.
   */
  logout(): Promise<void>;

  /**
   * Retorna o usuário atualmente autenticado ou null caso não haja.
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Observa mudanças no estado de autenticação. Retorna função para cancelar a inscrição.
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}