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
            return await this.ensureUserExistsInDatabase(authUser);
        } catch (error: any) {
            this.handleError(error, 'login');
            throw error; // Just to satisfy compiler
        }
    }

    async loginWithGoogle(): Promise<User> {
        try {
            const authUser = await this.authService.loginWithGoogle();
            return await this.ensureUserExistsInDatabase(authUser);
        } catch (error: any) {
            this.handleError(error, 'loginWithGoogle');
            throw error;
        }
    }

    private async ensureUserExistsInDatabase(authUser: User): Promise<User> {
        let fullUser = await this.userRepository.getUserByID(authUser.uID);

        if (!fullUser) {
            // AUTO-HEALING: Se o usuário existe no Auth mas não no Banco (ex: criado antes de limpar o banco ou via OAuth)
            // Criamos o registro automaticamente para permitir o login.
            console.warn(`⚠️ Usuário ${authUser.email} encontrado no Auth mas não na tabela 'users'. Criando registro...`);
            
            // Extrai nome do email ou metadados se disponíveis (futuro)
            const nameFromEmail = authUser.email ? authUser.email.split('@')[0] : 'Usuário';

            fullUser = makeUser({ 
                id: authUser.uID, 
                name: nameFromEmail, // Nome provisório
                email: authUser.email || '', 
                role: 'patient' 
            });
            
            try {
                await this.userRepository.createUser(fullUser);
            } catch (createError: any) {
                // AUTO-HEALING: Se erro for chave duplicada, significa que o usuário JÁ EXISTE no banco,
                // mas por alguma razão (race condition, delay, RLS) o getUserByID retornou null.
                // Nesse caso, assumimos sucesso e retornamos o objeto.
                const isDuplicate = createError.message && (
                    createError.message.includes('duplicate key') || 
                    createError.message.includes('users_pkey') ||
                    createError.code === '23505' // Código SQL padrão para unique violation
                );

                if (isDuplicate) {
                    console.warn(`⚠️ Race condition detectada: Usuário ${authUser.email} já existe no banco. Ignorando erro de criação.`);
                    return fullUser;
                }

                // Se der outro erro na criação, logamos e retornamos o básico
                console.error("Erro ao criar usuário automático:", createError);
                // Retorna o usuário básico para não bloquear o login, mas sem persistência completa
                return fullUser;
            }
        }
        return fullUser;
    }

    private handleError(error: any, context: string) {
        if (error instanceof AuthError || error instanceof RepositoryError || error instanceof ValidationError) {
            throw error;
        }
        // Inclui a mensagem original do erro para facilitar o debug
        throw new Error(`Erro interno no ${context}: ${error.message || error}`);
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
                    // Usa ensureUserExistsInDatabase para garantir que o usuário exista no banco local
                    // mesmo que seja o primeiro login via evento de sessão
                    const fullUser = await this.ensureUserExistsInDatabase(authUser);
                    callback(fullUser);
                } catch (error) {
                    console.error("Erro no onAuthStateChanged:", error);
                    callback(null);
                }
            } else {
                callback(null);
            }
        });
    }
}