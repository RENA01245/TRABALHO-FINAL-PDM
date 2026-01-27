import User from "@/model/entities/user";

export interface IAuthUseCases {
    getCurrentUser(): unknown;
    login(email: string, password: string): Promise<User>;
    loginWithGoogle(): Promise<User>;
    signUp(name: string, email: string, password: string): Promise<User>;
    updateUser(user: User): Promise<void>;
    logout(): Promise<void>;
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
}