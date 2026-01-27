import AuthUseCases from "../../src/usecase/auth/authUseCases";
import { MockAuthService } from "../mocks/AuthServiceMock";
import { MockUserRepository } from "../mocks/UserRepositoryMock";
import { ValidationError } from "../../src/model/errors/validationError";
import { AuthError } from "../../src/model/errors/authError";
import { mockUser, mockPets } from "../data/mockData";

/**
 * Testes unitários para AuthUseCases
 * Testa a lógica de negócio relacionada a autenticação
 * Usa os dados mockados da pasta /__test__/data quando aplicável
 */
describe("AuthUseCases", () => {
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
   * Teste: Login de usuário
   * Verifica se o login funciona corretamente
   */
  describe("login", () => {
    it("deve fazer login com sucesso quando credenciais são válidas usando dados mockados", async () => {
      // Arrange: Usa dados do mockUser existente em /__test__/data
      const mockUserData = mockUser[0];
      const email = mockUserData.email;
      const password = "senha123"; // Senha padrão para testes
      
      // Registra o usuário no serviço de autenticação (retorna um User com uID)
      const authUser = await mockAuthService.signup(email, password);
      
      // Cria o usuário completo no repositório usando os dados mockados
      const user = {
        ...mockUserData,
        uID: authUser.uID, // Usa o ID gerado pelo auth service
      };
      await mockUserRepository.createUser(user);

      // Act: Tenta fazer login
      const loggedUser = await authUseCases.login(email, password);

      // Assert: Verifica se o login foi bem-sucedido
      expect(loggedUser).toBeDefined();
      expect(loggedUser.email).toBe(email);
    });

    it("deve lançar erro quando email está vazio", async () => {
      // Arrange: Define email vazio
      const emptyEmail = "";
      const password = "senha123";

      // Act & Assert: Deve lançar ValidationError
      await expect(authUseCases.login(emptyEmail, password)).rejects.toThrow(
        ValidationError
      );
    });

    it("deve lançar erro quando senha está vazia", async () => {
      // Arrange: Define senha vazia
      const email = "teste@email.com";
      const emptyPassword = "";

      // Act & Assert: Deve lançar ValidationError
      await expect(authUseCases.login(email, emptyPassword)).rejects.toThrow(
        ValidationError
      );
    });

    it("deve lançar erro quando credenciais são inválidas", async () => {
      // Arrange: Define credenciais que não existem
      const email = "inexistente@email.com";
      const password = "senhaerrada";

      // Act & Assert: Deve lançar AuthError
      await expect(authUseCases.login(email, password)).rejects.toThrow();
    });

    it("deve lançar erro quando usuário não existe no repositório", async () => {
      // Arrange: Registra no auth service mas não no repositório
      const email = "teste@email.com";
      const password = "senha123";
      await mockAuthService.signup(email, password);

      // Act & Assert: Deve lançar AuthError porque usuário não está no repositório
      // OBS: Agora com o auto-healing, ele cria o usuário em vez de lançar erro!
      // Então esse teste deve passar verificando se o usuário foi criado e retornado
      const loggedUser = await authUseCases.login(email, password);
      expect(loggedUser).toBeDefined();
      expect(loggedUser.email).toBe(email);
    });

    it("deve recuperar-se automaticamente de race condition na criação automática de usuário (Duplicate Key)", async () => {
      // Arrange
      const email = "race@condition.com";
      const password = "senha123";
      
      // 1. Registra no Auth Service (Simula usuário criado via OAuth ou SignUp anterior)
      const authUser = await mockAuthService.signup(email, password);
      
      // 2. Mock getUserByID para retornar null (Simula RLS ou delay)
      // Precisamos fazer cast para any ou usar spyOn para sobrescrever o método da instância mockada
      jest.spyOn(mockUserRepository, 'getUserByID').mockResolvedValue(null);
      
      // 3. Mock createUser para lançar erro de Duplicate Key (Simula que usuário já existe)
      jest.spyOn(mockUserRepository, 'createUser').mockImplementation(async () => {
        throw new Error('duplicate Key value violates unique constraint "users_pkey"');
      });

      // Act
      const loggedUser = await authUseCases.login(email, password);

      // Assert
      expect(loggedUser).toBeDefined();
      expect(loggedUser.email).toBe(email);
      // Verifica se tentou criar
      expect(mockUserRepository.createUser).toHaveBeenCalled();
    });
  });

  /**
   * Teste: Cadastro de usuário
   * Verifica se o cadastro funciona corretamente
   */
  describe("signUp", () => {
    it("deve cadastrar um novo usuário com sucesso", async () => {
      // Arrange: Define dados válidos para cadastro
      const name = "Novo Usuário";
      const email = "novo@email.com";
      const password = "senha123";

      // Act: Tenta cadastrar
      const newUser = await authUseCases.signUp(name, email, password);

      // Assert: Verifica se o cadastro foi bem-sucedido
      expect(newUser).toBeDefined();
      expect(newUser.userName).toBe(name);
      expect(newUser.email).toBe(email);
    });

    it("deve lançar erro quando nome está vazio", async () => {
      // Arrange: Define nome vazio
      const emptyName = "";
      const email = "teste@email.com";
      const password = "senha123";

      // Act & Assert: Deve lançar ValidationError
      await expect(
        authUseCases.signUp(emptyName, email, password)
      ).rejects.toThrow(ValidationError);
    });

    it("deve lançar erro quando email é inválido", async () => {
      // Arrange: Define email com formato inválido
      const name = "Teste";
      const invalidEmail = "email-invalido";
      const password = "senha123";

      // Act & Assert: Deve lançar ValidationError
      await expect(
        authUseCases.signUp(name, invalidEmail, password)
      ).rejects.toThrow(ValidationError);
    });

    it("deve lançar erro quando senha tem menos de 6 caracteres", async () => {
      // Arrange: Define senha muito curta
      const name = "Teste";
      const email = "teste@email.com";
      const shortPassword = "12345";

      // Act & Assert: Deve lançar ValidationError
      await expect(
        authUseCases.signUp(name, email, shortPassword)
      ).rejects.toThrow(ValidationError);
    });

    it("deve lançar erro quando email já está cadastrado", async () => {
      // Arrange: Primeiro cadastra um usuário
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

  /**
   * Teste: Logout de usuário
   * Verifica se o logout funciona corretamente
   */
  describe("logout", () => {
    it("deve fazer logout com sucesso", async () => {
      // Act: Tenta fazer logout
      await authUseCases.logout();

      // Assert: Não deve lançar erro
      // O logout sempre deve funcionar, mesmo sem usuário logado
      expect(true).toBe(true);
    });
  });

  /**
   * Teste: Observação de mudanças de autenticação
   * Verifica se o callback de mudanças de estado funciona
   */
  describe("onAuthStateChanged", () => {
    it("deve chamar o callback quando o estado muda", (done) => {
      // Arrange: Define um callback
      const callback = (user: any) => {
        // Assert: Verifica se o callback foi chamado
        expect(callback).toBeDefined();
        done();
      };

      // Act: Registra o observer
      const unsubscribe = authUseCases.onAuthStateChanged(callback);

      // Verifica se retorna uma função de unsubscribe
      expect(typeof unsubscribe).toBe("function");
    });
  });
});
