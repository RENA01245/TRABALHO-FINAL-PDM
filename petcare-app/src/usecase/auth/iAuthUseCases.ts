import User from "@/model/entities/user";

export interface IAuthUseCases {
    login(email: string, password: string): Promise<User>;
    signUp(name: string, email: string, password: string): Promise<User>;
    logout(): Promise<void>;
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
}