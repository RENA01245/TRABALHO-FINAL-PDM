import AuthUseCases from "../../src/usecase/auth/authUseCases";
import { MockAuthService } from "../mocks/AuthServiceMock";
import { MockUserRepository } from "../mocks/UserRepositoryMock";
import { makeUser } from "../helpers/userHelper";
import { mockUser } from "../data/mockData";

/**
 * Testes de integração para fluxo completo de autenticação
 * Testa a integração entre AuthService e UserRepository
 * Usa os dados mockados da pasta /__test__/data
 */
describe("Fluxo de Autenticação - Integração", () => {
  let authUseCases: AuthUseCases;
  let mockAuthService: MockAuthService;
  let mockUserRepository: MockUserRepository;

  // Executa antes de cada teste
  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockUserRepository = new MockUserRepository();
    authUseCases = new AuthUseCases(mockAuthService, mockUserRepository);
  });

  /**
   * Teste: Fluxo completo de cadastro e login usando dados mockados
   * Simula o fluxo real de um usuário se cadastrando e depois fazendo login
   * Usa os dados do mockUser da pasta /__test__/data
   */
  it("deve permitir cadastro e login completo usando dados mockados", async () => {
    // Arrange: Usa dados do mockUser existente em /__test__/data
    const mockUserData = mockUser[0];
    const name = mockUserData.userName;
    const email = mockUserData.email;
    const password = "senha123"; // Senha padrão para testes

    // Act 1: Cadastra o usuário
    const newUser = await authUseCases.signUp(name, email, password);

    // Assert 1: Verifica se o cadastro foi bem-sucedido
    expect(newUser).toBeDefined();
    expect(newUser.userName).toBe(name);
    expect(newUser.email).toBe(email);

    // Act 2: Faz logout (simula que o usuário saiu)
    await authUseCases.logout();

    // Act 3: Faz login novamente
    const loggedUser = await authUseCases.login(email, password);

    // Assert 2: Verifica se o login foi bem-sucedido
    expect(loggedUser).toBeDefined();
    expect(loggedUser.email).toBe(email);
    expect(loggedUser.userName).toBe(name);
  });

  /**
   * Teste: Fluxo de múltiplos usuários
   * Verifica se o sistema suporta múltiplos usuários simultaneamente
   */
  it("deve suportar múltiplos usuários cadastrados", async () => {
    // Arrange: Define dados de dois usuários diferentes
    const user1 = {
      name: "Maria Santos",
      email: "maria@email.com",
      password: "senha123",
    };

    const user2 = {
      name: "Pedro Costa",
      email: "pedro@email.com",
      password: "senha456",
    };

    // Act: Cadastra ambos os usuários
    const newUser1 = await authUseCases.signUp(
      user1.name,
      user1.email,
      user1.password
    );
    const newUser2 = await authUseCases.signUp(
      user2.name,
      user2.email,
      user2.password
    );

    // Assert: Verifica se ambos foram cadastrados corretamente
    expect(newUser1.email).toBe(user1.email);
    expect(newUser2.email).toBe(user2.email);
    expect(newUser1.uID).not.toBe(newUser2.uID); // IDs devem ser diferentes
  });

  /**
   * Teste: Fluxo de tentativa de login com usuário não cadastrado
   * Verifica o comportamento quando tenta fazer login sem estar cadastrado
   */
  it("deve rejeitar login de usuário não cadastrado", async () => {
    // Arrange: Define credenciais de um usuário que não existe
    const email = "naoexiste@email.com";
    const password = "senha123";

    // Act & Assert: Deve lançar erro ao tentar fazer login
    await expect(authUseCases.login(email, password)).rejects.toThrow();
  });

  /**
   * Teste: Fluxo de cadastro duplicado
   * Verifica se o sistema impede cadastro com email duplicado
   */
  it("deve impedir cadastro com email duplicado", async () => {
    // Arrange: Cadastra um usuário primeiro
    const name = "Teste";
    const email = "teste@email.com";
    const password = "senha123";

    await authUseCases.signUp(name, email, password);

    // Act & Assert: Tenta cadastrar novamente com o mesmo email
    await expect(
      authUseCases.signUp("Outro Nome", email, "outrasenha")
    ).rejects.toThrow();
  });
});
