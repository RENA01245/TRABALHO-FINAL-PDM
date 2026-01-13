import User from "../../petcare-app/src/model/entities/user";
import { IAuthService, AuthCredentials } from "../../petcare-app/src/model/services/iAuthService";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../../petcare-app/src/model/errors/authErrors";

export class MockAuthService implements IAuthService {
  private currentUser: User | null;
  private users: User[];
  private passwordStore: Record<string, string>;

  constructor(initialUser?: User) {
    this.users = initialUser ? [initialUser] : [];
    this.passwordStore = {};
    if (initialUser) {
      this.passwordStore[initialUser.userName] = "password"; // password padrão para mock
    }
    this.currentUser = initialUser || null;
  }

  async login(credentials: AuthCredentials): Promise<User> {
    const found = this.users.find(u => u.userName === credentials.userName);
    if (!found) throw new InvalidCredentialsError();
    const pw = this.passwordStore[credentials.userName];
    if (pw !== credentials.password) throw new InvalidCredentialsError();
    this.currentUser = found;
    return found;
  }

  async signup(credentials: AuthCredentials): Promise<User> {
    if (this.users.find(u => u.userName === credentials.userName)) {
      throw new UserAlreadyExistsError();
    }
    const newUser: User = {
      id: String(Date.now()),
      userName: credentials.userName,
      email: null
    };
    this.users.push(newUser);
    this.passwordStore[credentials.userName] = credentials.password;
    this.currentUser = newUser;
    return newUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // Mock simples: não há eventos reais, chamamos callback imediatamente
    callback(this.currentUser);
    return () => { /* no-op */ };
  }
}

export default MockAuthService;