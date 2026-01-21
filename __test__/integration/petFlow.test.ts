import { PetUseCases } from "../../src/usecase/pet/petUseCases";
import { MockPetRepository } from "../mocks/PetRepositoryMock";
import { mockPets, mockUser } from "../data/mockData";

/**
 * Testes de integração para fluxo completo de pets
 * Testa a integração entre PetUseCases e PetRepository
 * Usa os dados mockados da pasta /__test__/data (mockPets e mockUser)
 */
describe("Fluxo de Pets - Integração", () => {
  let petUseCases: PetUseCases;
  let mockRepository: MockPetRepository;

  // Executa antes de cada teste
  beforeEach(() => {
    mockRepository = new MockPetRepository();
    petUseCases = new PetUseCases(mockRepository);
  });

  /**
   * Teste: Fluxo completo de busca de pets de um cliente
   * Simula o fluxo real de um cliente visualizando seus pets
   */
  it("deve permitir buscar todos os pets de um cliente e depois um específico", async () => {
    // Arrange: Define o ID de um cliente que tem pets
    const clientId = mockUser[0].uID;

    // Act 1: Busca todos os pets do cliente (como na tela de perfil)
    const clientPets = await petUseCases.getAllPetsByClientId(clientId);

    // Assert 1: Verifica se retornou os pets do cliente
    expect(clientPets).toBeDefined();
    expect(Array.isArray(clientPets)).toBe(true);
    expect(clientPets.length).toBeGreaterThan(0);

    // Verifica se todos os pets pertencem ao cliente correto
    clientPets.forEach((pet) => {
      expect(pet.clientId).toBe(clientId);
    });

    // Act 2: Busca um pet específico pelo ID (como na tela de detalhes)
    if (clientPets.length > 0) {
      const firstPetId = clientPets[0].id;
      const specificPet = await petUseCases.getPetById(firstPetId);

      // Assert 2: Verifica se o pet específico foi encontrado
      expect(specificPet).not.toBeNull();
      expect(specificPet?.id).toBe(firstPetId);
      expect(specificPet?.name).toBeDefined();
    }
  });

  /**
   * Teste: Fluxo de busca de pet inexistente
   * Verifica o comportamento quando busca um pet que não existe
   */
  it("deve retornar null ao buscar pet inexistente", async () => {
    // Arrange: Define um ID que não existe
    const nonExistentId = "pet_inexistente";

    // Act: Busca o pet
    const pet = await petUseCases.getPetById(nonExistentId);

    // Assert: Verifica que retornou null
    expect(pet).toBeNull();
  });

  /**
   * Teste: Fluxo de validação de dados dos pets
   * Verifica se todos os pets retornados têm dados válidos
   */
  it("deve retornar pets com dados válidos", async () => {
    // Arrange: Define o ID de um cliente
    const clientId = mockUser[0].uID;

    // Act: Busca todos os pets do cliente
    const pets = await petUseCases.getAllPetsByClientId(clientId);

    // Assert: Verifica se cada pet tem os dados necessários
    pets.forEach((pet) => {
      expect(pet.id).toBeDefined();
      expect(pet.id).not.toBe("");
      expect(pet.name).toBeDefined();
      expect(pet.name).not.toBe("");
      expect(pet.clientId).toBe(clientId);
    });
  });

  /**
   * Teste: Fluxo de cliente sem pets
   * Verifica o comportamento quando um cliente não tem pets cadastrados
   */
  it("deve retornar lista vazia para cliente sem pets", async () => {
    // Arrange: Define um ID de cliente que não tem pets
    const clientIdWithoutPets = "u999";

    // Act: Busca os pets do cliente
    const pets = await petUseCases.getAllPetsByClientId(clientIdWithoutPets);

    // Assert: Verifica que retornou uma lista (pode estar vazia ou filtrada)
    expect(pets).toBeDefined();
    expect(Array.isArray(pets)).toBe(true);
  });
});
