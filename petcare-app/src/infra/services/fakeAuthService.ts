import User from "@/model/entities/user";
import { AuthError } from "@/model/errors/authError";
import { IAuthService } from "@/model/services/iAuthService";

export class FakeAuthService implements IAuthService {
  async login(userName: string, password: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Admin mock
    if (userName === "admin@petcare.com" && password === "admin123") {
      return {
        uID: "admin-123-456-789-abc-def",
        userName: "Administrador",
        email: "admin@petcare.com",
        role: "admin",
      };
    }
    
    // Usuário comum mock
    if (userName !== "test" || password !== "test") {
      throw new AuthError("Invalid credentials");
    }
    return {
      uID: "123",
      userName: "test",
      email: "test@email.com",
      role: "patient",
    };
  }

  async signup(userName: string, password: string): Promise<User> {
    throw new AuthError("Signup not implemented");
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Promise.resolve();
  }

  onAuthStateChanged(callback: (user: User | null) => void): void {
    //callback(null);
  }
}