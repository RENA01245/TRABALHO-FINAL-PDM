import { ServiceUseCases } from "../../src/usecase/service/serviceUseCases";
import { MockServiceRepository } from "../mocks/ServiceRepositoryMock";
import { mockServices } from "../data/mockData";

/**
 * Testes de integração para fluxo completo de serviços
 * Testa a integração entre ServiceUseCases e ServiceRepository
 * Usa os dados mockados da pasta /__test__/data (mockServices)
 */
describe("Fluxo de Serviços - Integração", () => {
  let serviceUseCases: ServiceUseCases;
  let mockRepository: MockServiceRepository;

  // Executa antes de cada teste
  beforeEach(() => {
    mockRepository = new MockServiceRepository();
    serviceUseCases = new ServiceUseCases(mockRepository);
  });

  /**
   * Teste: Fluxo completo de busca de serviços
   * Simula o fluxo real de um usuário buscando e visualizando serviços
   */
  it("deve permitir buscar todos os serviços e depois um específico", async () => {
    // Act 1: Busca todos os serviços (como na tela inicial)
    const allServices = await serviceUseCases.getAllServices();

    // Assert 1: Verifica se retornou todos os serviços
    expect(allServices).toHaveLength(mockServices.length);
    expect(allServices.length).toBeGreaterThan(0);

    // Act 2: Busca um serviço específico pelo ID (como na tela de detalhes)
    const firstServiceId = allServices[0].id;
    const specificService = await serviceUseCases.getServiceById(firstServiceId);

    // Assert 2: Verifica se o serviço específico foi encontrado
    expect(specificService).not.toBeNull();
    expect(specificService?.id).toBe(firstServiceId);
    expect(specificService?.name).toBeDefined();
  });

  /**
   * Teste: Fluxo de filtragem de serviços por tipo
   * Simula um usuário filtrando serviços por categoria
   */
  it("deve permitir filtrar serviços por tipo", async () => {
    // Act: Busca todos os serviços
    const allServices = await serviceUseCases.getAllServices();

    // Act: Filtra serviços do tipo 'service' (banho, tosa, etc)
    const serviceTypeServices = allServices.filter(
      (s) => s.type === "service"
    );

    // Assert: Verifica se encontrou serviços do tipo correto
    expect(serviceTypeServices.length).toBeGreaterThan(0);
    serviceTypeServices.forEach((service) => {
      expect(service.type).toBe("service");
    });

    // Act: Filtra serviços do tipo 'consultation'
    const consultationServices = allServices.filter(
      (s) => s.type === "consultation"
    );

    // Assert: Verifica se encontrou consultas
    expect(consultationServices.length).toBeGreaterThan(0);
    consultationServices.forEach((service) => {
      expect(service.type).toBe("consultation");
    });
  });

  /**
   * Teste: Fluxo de busca de serviço inexistente
   * Verifica o comportamento quando busca um serviço que não existe
   */
  it("deve retornar null ao buscar serviço inexistente", async () => {
    // Arrange: Define um ID que não existe
    const nonExistentId = "servico_inexistente";

    // Act: Busca o serviço
    const service = await serviceUseCases.getServiceById(nonExistentId);

    // Assert: Verifica que retornou null
    expect(service).toBeNull();
  });

  /**
   * Teste: Fluxo de validação de dados dos serviços
   * Verifica se todos os serviços retornados têm dados válidos
   */
  it("deve retornar serviços com dados válidos", async () => {
    // Act: Busca todos os serviços
    const services = await serviceUseCases.getAllServices();

    // Assert: Verifica se cada serviço tem os dados necessários
    services.forEach((service) => {
      expect(service.id).toBeDefined();
      expect(service.id).not.toBe("");
      expect(service.name).toBeDefined();
      expect(service.name).not.toBe("");
      expect(service.price).toBeGreaterThanOrEqual(0);
    });
  });
});
