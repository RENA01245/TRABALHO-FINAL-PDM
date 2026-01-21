import User from "../../src/model/entities/user";

/**
 * Helper para criar objetos User nos testes
 * Simula a função makeUser que é usada no código de produção
 */
export function makeUser(params: {
  id: string;
  name: string;
  email: string;
  role?: string;
}): User {
  return {
    uID: params.id,
    userName: params.name,
    email: params.email,
    telefone: null,
    pets: [],
  };
}
