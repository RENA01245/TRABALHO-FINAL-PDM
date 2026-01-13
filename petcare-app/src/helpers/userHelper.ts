import User, { UserRole } from "../model/entities/user";

/**
 * Helper para criar objetos User
 * Converte dados de autenticação em um objeto User completo
 */
export function makeUser(params: {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}): User {
  return {
    uID: params.id,
    userName: params.name,
    email: params.email,
    telefone: null,
    pets: [],
    role: params.role || 'patient',
  };
}
