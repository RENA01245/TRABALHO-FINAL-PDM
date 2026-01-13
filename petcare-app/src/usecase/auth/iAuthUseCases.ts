import User from "../../model/entities/user";
import { AuthCredentials } from "../../model/services/iAuthService";

export interface IAuthUseCases {
  login(credentials: AuthCredentials): Promise<User>;
  signup(credentials: AuthCredentials): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}