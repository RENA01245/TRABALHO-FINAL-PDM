import User from "../entities/user";

export interface IUserRepository {
  createUser(user: User): Promise<void>;
  getUserByID(uID: string): Promise<User | null>;
  
}