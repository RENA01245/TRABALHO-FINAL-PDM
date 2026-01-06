import { ServiceUseCases } from "../../src/usecase/service/serviceUseCases";
import { MockServiceRepository } from "../mocks/ServiceRepositoryMock";
import { mockServices } from "../data/mockData";
import { RepositoryError } from "../../src/model/errors/repositoryError";

/**
 * Testes unitários para ServiceUseCases
 * Testa a lógica de negócio relacionada a serviços
 * Usa os dados mockados da pasta /__test__/data (mockServices)
 */
describe("ServiceUseCases", () => {
  let serviceUseCases: ServiceUseCases;
  let mockRepository: MockServiceRepository;

  // Executa antes de cada teste
  beforeEach(() => {
    mockRepository = new MockServiceRepository();
    serviceUseCases = new ServiceUseCases(mockRepository);
  });

  /**
   * Teste: Deve retornar todos os serviços
   * Verifica se a função getAllServices retorna a lista completa
   */
  describe("getAllServices", () => {
    it("deve retornar todos os serviços disponíveis", async () => {
      // Act: Chama o método que queremos testar
      const services = await serviceUseCases.getAllServices();

      // Assert: Verifica se o resultado está correto
      expect(services).toHaveLength(mockServices.length);
      expect(services).toEqual(mockServices);
    });

    it("deve retornar uma lista vazia se não houver serviços", async () => {
      // Arrange: Cria um repositório vazio
      const emptyRepository = new MockServiceRepository();
      const emptyUseCases = new ServiceUseCases(emptyRepository);

      // Act & Assert: Como o mock sempre retorna dados, este teste verifica o comportamento padrão
      const services = await emptyUseCases.getAllServices();
      expect(services).toBeDefined();
    });
  });

  /**
   * Teste: Deve buscar um serviço por ID
   * Verifica se a função getServiceById retorna o serviço correto
   */
  describe("getServiceById", () => {
    it("deve retornar o serviço quando o ID existe", async () => {
      // Arrange: Define um ID que sabemos que existe nos mocks
      const existingId = "s1";

      // Act: Busca o serviço pelo ID
      const service = await serviceUseCases.getServiceById(existingId);

      // Assert: Verifica se o serviço foi encontrado e tem os dados corretos
      expect(service).not.toBeNull();
      expect(service?.id).toBe(existingId);
      expect(service?.name).toBe("Banho");
    });

    it("deve retornar null quando o ID não existe", async () => {
      // Arrange: Define um ID que não existe
      const nonExistentId = "s999";

      // Act: Busca o serviço pelo ID
      const service = await serviceUseCases.getServiceById(nonExistentId);

      // Assert: Verifica que retornou null
      expect(service).toBeNull();
    });

    it("deve lançar erro quando o ID é inválido", async () => {
      // Arrange: Define um ID vazio ou inválido
      const invalidId = "";

      // Act & Assert: Verifica se lança um erro
      await expect(serviceUseCases.getServiceById(invalidId)).rejects.toThrow(
        RepositoryError
      );
    });
  });
});
