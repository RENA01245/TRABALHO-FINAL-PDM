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
            const fullUser = await this.userRepository.getUserByID(authUser.uID);

            if (!fullUser) {
                throw new AuthError('Usuário não encontrado no sistema');
            }

            return fullUser;
        } catch (error) {
            if (error instanceof AuthError || error instanceof RepositoryError || error instanceof ValidationError) {
                throw error;
            }
            throw new Error('Erro interno no login');
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
            if (authUser) {
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