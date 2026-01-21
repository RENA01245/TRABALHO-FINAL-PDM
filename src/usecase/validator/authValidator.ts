import { ValidationError } from "@/model/errors/validationError";

export default class AuthValidator {
    static validateLogin(email: string, password: string): void {
        if (!email || email.trim().length === 0) {
            throw new ValidationError("Email é obrigatório");
        }

        if (!password || password.trim().length === 0) {
            throw new ValidationError("Senha é obrigatória");
        }
    }

    static validateSignUp(name: string, email: string, password: string): void {
        if (!name || name.trim().length === 0) {
            throw new ValidationError("Nome é obrigatório");
        }

        if (!email || email.trim().length === 0) {
            throw new ValidationError("Email é obrigatório");
        }

        if (!this.isValidEmail(email)) {
            throw new ValidationError("Email inválido");
        }

        if (!password || password.length < 6) {
            throw new ValidationError("Senha deve ter pelo menos 6 caracteres");
        }
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}