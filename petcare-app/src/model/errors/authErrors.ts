export class InvalidCredentialsError extends Error {
  constructor(message = "Credenciais inválidas") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(message = "Usuário já existe") {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}

export class AuthNetworkError extends Error {
  constructor(message = "Erro de rede ao autenticar") {
    super(message);
    this.name = "AuthNetworkError";
  }
}