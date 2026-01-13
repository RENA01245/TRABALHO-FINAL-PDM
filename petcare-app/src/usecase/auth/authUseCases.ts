import { IAuthUseCases } from "./iAuthUseCases";
import { IAuthService, AuthCredentials } from "../../model/services/iAuthService";
import { IUserRepository } from "../../model/repositories/iUserRepository";
import User from "../../model/entities/user";

export default class AuthUseCases implements IAuthUseCases {
  constructor(private authService: IAuthService, private userRepo: IUserRepository) {}

  async login(credentials: AuthCredentials): Promise<User> {
    const user = await this.authService.login(credentials);
    // opcional: sincronizar user no repositório local
    if (this.userRepo && user) {
      await this.userRepo.createUser(user).catch(() => {});
    }
    return user;
  }

  async signup(credentials: AuthCredentials): Promise<User> {
    const user = await this.authService.signup(credentials);
    if (this.userRepo && user) {
      await this.userRepo.createUser(user).catch(() => {});
    }
    return user;
  }

  async logout(): Promise<void> {
    return this.authService.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authService.getCurrentUser();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.authService.onAuthStateChanged(callback);
  }
}