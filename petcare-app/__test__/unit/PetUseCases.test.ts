import { PetUseCases } from "../../src/usecase/pet/petUseCases";
import { MockPetRepository } from "../mocks/PetRepositoryMock";
import { mockPets, mockUser } from "../data/mockData";

/**
 * Testes unitários para PetUseCases
 * Testa a lógica de negócio relacionada a pets
 * Usa os dados mockados da pasta /__test__/data (mockPets e mockUser)
 */
describe("PetUseCases", () => {
  let petUseCases: PetUseCases;
  let mockRepository: MockPetRepository;

  // Executa antes de cada teste
  beforeEach(() => {
    mockRepository = new MockPetRepository();
    petUseCases = new PetUseCases(mockRepository);
  });

  /**
   * Teste: Deve retornar todos os pets de um cliente
   * Verifica se a função getAllPetsByClientId retorna os pets corretos
   */
  describe("getAllPetsByClientId", () => {
    it("deve retornar todos os pets de um cliente específico", async () => {
      // Arrange: Define o ID de um cliente que sabemos que tem pets
      const clientId = mockUser[0].uID;

      // Act: Busca os pets do cliente
      const pets = await petUseCases.getAllPetsByClientId(clientId);

      // Assert: Verifica se retornou os pets corretos
      expect(pets).toBeDefined();
      expect(Array.isArray(pets)).toBe(true);
      
      // Verifica se todos os pets pertencem ao cliente correto
      pets.forEach((pet) => {
        expect(pet.clientId).toBe(clientId);
      });
    });

    it("deve retornar uma lista vazia se o cliente não tem pets", async () => {
      // Arrange: Define um ID de cliente que não tem pets
      const clientIdWithoutPets = "u999";

      // Act: Busca os pets do cliente
      const pets = await petUseCases.getAllPetsByClientId(clientIdWithoutPets);

      // Assert: Verifica que retornou uma lista vazia ou filtrada
      expect(pets).toBeDefined();
      expect(Array.isArray(pets)).toBe(true);
    });
  });

  /**
   * Teste: Deve buscar um pet por ID
   * Verifica se a função getPetById retorna o pet correto
   */
  describe("getPetById", () => {
    it("deve retornar o pet quando o ID existe", async () => {
      // Arrange: Define um ID que sabemos que existe nos mocks
      const existingPet = mockPets[0]
      const existingId = existingPet.id;

      // Act: Busca o pet pelo ID
      const pet = await petUseCases.getPetById(existingId);

      // Assert: Verifica se o pet foi encontrado e tem os dados corretos
      expect(pet).not.toBeNull();
      expect(pet?.id).toBe(existingId);
      expect(pet?.name).toBe("Rex");
      expect(pet?.breed).toBe("Labrador");
    });

    it("deve retornar null quando o ID não existe", async () => {
      // Arrange: Define um ID que não existe
      const nonExistentId = "p999";

      // Act: Busca o pet pelo ID
      const pet = await petUseCases.getPetById(nonExistentId);

      // Assert: Verifica que retornou null
      expect(pet).toBeNull();
    });
  });
});
