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

    async login(email: string, password: string): Promise<User> {
        AuthValidator.validateLogin(email, password);

        try {
            const authUser = await this.authService.login(email, password);
            
            // Se for admin mock (não existe no repositório), retorna direto
            // O HybridAuthService já retorna o usuário completo com role
            if (authUser.role === 'admin' && authUser.uID === 'admin-123-456-789-abc-def') {
                return authUser;
            }

            // Para outros usuários, busca no repositório
            const fullUser = await this.userRepository.getUserByID(authUser.uID);

            if (!fullUser) {
                throw new AuthError('Usuário não encontrado no sistema');
            }

            // Preserva o role se vier do authService
            return {
                ...fullUser,
                role: authUser.role || fullUser.role || 'patient',
            };
        } catch (error) {
            if (error instanceof AuthError || error instanceof RepositoryError || error instanceof ValidationError) {
                throw error;
            }
            // Log do erro real para debug
            console.error('Erro interno no login:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            throw new Error(`Erro interno no login: ${errorMessage}`);
        }
    }

    async signUp(name: string, email: string, password: string): Promise<User> {
        AuthValidator.validateSignUp(name, email, password);

        try {
            const authUser = await this.authService.signup(email, password);
            const fullUser = makeUser({ id: authUser.uID, name, email, role: 'patient' });
            await this.userRepository.createUser(fullUser);
            return fullUser;
        } catch (error) {
            if (error instanceof AuthError || error instanceof RepositoryError || error instanceof ValidationError) {
                throw error;
            }
            throw new Error('Erro interno no registro');
        }
    }

    async logout(): Promise<void> {
        try {
            await this.authService.logout();
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new Error('Erro interno no logout');
        }
    }

    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return this.authService.onAuthStateChanged(async (authUser) => {
            console.log('🔐 [AuthUseCases] onAuthStateChanged chamado:', authUser?.userName, 'Pets:', authUser?.pets?.length || 0);
            if (authUser && authUser.uID) {
                // Se for admin mock, retorna direto (não existe no repositório)
                if (authUser.role === 'admin' && authUser.uID === 'admin-123-456-789-abc-def') {
                    console.log('✅ [AuthUseCases] Retornando admin mock com pets:', authUser.pets?.length || 0);
                    callback(authUser);
                    return;
                }

                // PROTEÇÃO: Se o ID for de mock antigo ("u1"), ignore e force logout
                if (authUser.uID === 'u1' || (authUser.uID.length < 20 && authUser.uID !== 'admin-123-456-789-abc-def')) {
                    console.warn("⚠️ Sessão de mock detectada no banco real. Limpando...");
                    this.logout();
                    callback(null);
                    return;
                }
    
                try {
                    const fullUser = await this.userRepository.getUserByID(authUser.uID);
                    if (fullUser) {
                        // Preserva o role se vier do authService
                        callback({
                            ...fullUser,
                            role: authUser.role || fullUser.role || 'patient',
                        });
                    } else {
                        callback(null);
                    }
                } catch (error) {
                    callback(null);
                }
            } else {
                callback(null);
            }
        });
    }
}