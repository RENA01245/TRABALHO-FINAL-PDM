import AuthUseCases from "../../src/usecase/auth/authUseCases";
import { MockAuthService } from "../mocks/AuthServiceMock";
import { MockUserRepository } from "../mocks/UserRepositoryMock";
import { AuthError } from "../../src/model/errors/authError";
import { mockUser } from "../data/mockData";

describe("AuthUseCases - Cobertura Expandida", () => {
  let authUseCases: AuthUseCases;
  let mockAuthService: MockAuthService;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockUserRepository = new MockUserRepository();
    authUseCases = new AuthUseCases(mockAuthService, mockUserRepository);
  });

  // --- Testes de Sucesso (Caminho Feliz) ---
  it("deve completar o fluxo de login e cadastro com sucesso", async () => {
    const user = await authUseCases.signUp("Teste", "teste@email.com", "senha123");
    const logged = await authUseCases.login("teste@email.com", "senha123");
    expect(logged.uID).toBe(user.uID);
  });

  // --- Cobrindo as linhas 40 e 56 (Erros Internos/Genéricos) ---
  describe("Tratamento de Erros Inesperados", () => {
    it("deve lançar Erro Interno no login se o serviço falhar genericamente", async () => {
      jest.spyOn(mockAuthService, 'login').mockRejectedValueOnce(new Error("Crash Banco"));
      await expect(authUseCases.login("a@a.com", "123456")).rejects.toThrow('Erro interno no login');
    });

    it("deve lançar Erro Interno no registro se o repositório falhar", async () => {
      jest.spyOn(mockUserRepository, 'createUser').mockRejectedValueOnce(new Error("DB Offline"));
      await expect(authUseCases.signUp("Nome", "a@a.com", "123456")).rejects.toThrow('Erro interno no registro');
    });
  });

  // --- Cobrindo as linhas 64-67 (Erro no Logout) ---
  it("deve lançar erro interno se o logout falhar", async () => {
    jest.spyOn(mockAuthService, 'logout').mockRejectedValueOnce(new Error("Falha Rede"));
    await expect(authUseCases.logout()).rejects.toThrow('Erro interno no logout');
  });

  // --- Cobrindo as linhas 75-86 (Lógica do Observer) ---
  describe("onAuthStateChanged", () => {
    it("deve lidar com usuário nulo no observer", (done) => {
      // Simula o supabase retornando null (usuário deslogado)
      jest.spyOn(mockAuthService, 'onAuthStateChanged').mockImplementation((cb) => {
        cb(null);
        return () => {};
      });

      authUseCases.onAuthStateChanged((user) => {
        expect(user).toBeNull();
        done();
      });
    });

    it("deve buscar o usuário completo se o authUser for válido", (done) => {
      const fakeAuth = { uID: "ID_LONGO_PARA_PASSAR_NA_VALIDACAO_20_CHARS" };
      jest.spyOn(mockAuthService, 'onAuthStateChanged').mockImplementation((cb) => {
        cb(fakeAuth as any);
        return () => {};
      });
      
      jest.spyOn(mockUserRepository, 'getUserByID').mockResolvedValue(mockUser[0] as any);

      authUseCases.onAuthStateChanged((user) => {
        expect(user).not.toBeNull();
        done();
      });
    });
  });
});