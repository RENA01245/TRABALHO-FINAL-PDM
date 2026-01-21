import User from "@/model/entities/user";
import AuthValidator from "../validator/authValidator";
import { ValidationError } from "@/model/errors/validationError";
import { AuthError } from "@/model/errors/authError";
import { RepositoryError } from "@/model/errors/repositoryError";
import { IAuthService } from "@/model/services/iAuthService";
import { IUserRepository } from "@/model/repositories/iUserRepository";
import { IAuthUseCases } from "./iAuthUseCases";
import { makeUser } from "@/helpers/userHelper";

export default class AuthUseCases implements IAuthUseCases {

    private authService: IAuthService;
    private userRepository: IUserRepository;

    constructor(authService: IAuthService, userRepository: IUserRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }
    getCurrentUser(): unknown {
        throw new Error("Method not implemented.");
    }

    async login(email: string, password: string): Promise<User> {
        AuthValidator.validateLogin(email, password);

        try {
            const authUser = await this.authService.login(email, password);
            let fullUser = await this.userRepository.getUserByID(authUser.uID);

            if (!fullUser) {
                // AUTO-HEALING: Se o usuário existe no Auth mas não no Banco (ex: criado antes de limpar o banco)
                // Criamos o registro automaticamente para permitir o login.
                console.warn(`⚠️ Usuário ${email} encontrado no Auth mas não na tabela 'users'. Criando registro...`);
                
                fullUser = makeUser({ 
                    id: authUser.uID, 
                    name: authUser.email.split('@')[0], // Nome provisório
                    email: authUser.email, 
                    role: 'patient' 
                });
                
                await this.userRepository.createUser(fullUser);
            }

            return fullUser;
        } catch (error: any) {
            if (error instanceof AuthError || error instanceof RepositoryError || error instanceof ValidationError) {
                throw error;
            }
            // Inclui a mensagem original do erro para facilitar o debug
            throw new Error(`Erro interno no login: ${error.message || error}`);
        }
    }

    async signUp(name: string, email: string, password: string): Promise<User> {
        AuthValidator.validateSignUp(name, email, password);

        try {
            const authUser = await this.authService.signup(email, password);
            const fullUser = makeUser({ id: authUser.uID, name, email, role: 'patient' });
            await this.userRepository.createUser(fullUser);
            return fullUser;
        } catch (error: any) {
            if (error instanceof AuthError || error instanceof RepositoryError || error instanceof ValidationError) {
                throw error;
            }
            // Inclui a mensagem original do erro para facilitar o debug
            throw new Error(`Erro interno no registro: ${error.message || error}`);
        }
    }

    async updateUser(user: User): Promise<void> {
        try {
            await this.userRepository.updateUser(user);
        } catch (error: any) {
            if (error instanceof RepositoryError) {
                throw error;
            }
            throw new Error(`Erro ao atualizar usuário: ${error.message || error}`);
        }
    }

    async logout(): Promise<void> {
        try {
            await this.authService.logout();
        } catch (error: any) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new Error(error.message || 'Erro interno no logout');
        }
    }

    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return this.authService.onAuthStateChanged(async (authUser) => {
            if (authUser && authUser.uID) {
                // PROTEÇÃO: Se o ID for de mock ("u1"), ignore e force logout
                if (authUser.uID === 'u1' || authUser.uID.length < 20) {
                    console.warn("⚠️ Sessão de mock detectada no banco real. Limpando...");
                    this.logout();
                    callback(null);
                    return;
                }
    
                try {
                    const fullUser = await this.userRepository.getUserByID(authUser.uID);
                    callback(fullUser);
                } catch (error) {
                    callback(null);
                }
            } else {
                callback(null);
            }
        });
    }
}