import User from "../entities/user";

export interface IAuthService {
  login(userName: string, password: string): Promise<User>;

  signup(userName: string, password: string): Promise<User>;

  logout(): Promise<void>;

  onAuthStateChanged(callback: (user: User | null) => void): void;
}