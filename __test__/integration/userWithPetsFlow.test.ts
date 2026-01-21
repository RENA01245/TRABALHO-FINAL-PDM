import AuthUseCases from "../../src/usecase/auth/authUseCases";
import { PetUseCases } from "../../src/usecase/pet/petUseCases";
import { MockAuthService } from "../mocks/AuthServiceMock";
import { MockUserRepository } from "../mocks/UserRepositoryMock";
import { MockPetRepository } from "../mocks/PetRepositoryMock";
import { mockUser, mockPets } from "../data/mockData";
import Pet from "../../src/model/entities/pet";

/**
 * Testes de integração para fluxo completo de usuário com pets
 * Testa a integração entre AuthUseCases e PetUseCases
 * Usa os dados mockados da pasta /__test__/data
 */
describe("Fluxo de Usuário com Pets - Integração", () => {
  let authUseCases: AuthUseCases;
  let petUseCases: PetUseCases;
  let mockAuthService: MockAuthService;
  let mockUserRepository: MockUserRepository;
  let mockPetRepository: MockPetRepository;

  // Executa antes de cada teste
  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockUserRepository = new MockUserRepository();
    mockPetRepository = new MockPetRepository();
    authUseCases = new AuthUseCases(mockAuthService, mockUserRepository);
    petUseCases = new PetUseCases(mockPetRepository);
  });

  /**
   * Teste: Fluxo completo de login e busca de pets
   * Simula um usuário fazendo login e depois buscando seus pets
   * Usa os dados mockados do mockUser e mockPets
   */
  it("deve permitir login e buscar pets do usuário usando dados mockados", async () => {
    // Arrange
    const mockUserData = mockUser[0];
    const email = mockUserData.email;
    const password = "senha123";

    // 1. Registra no auth service para obter o ID dinâmico (ex: user_123...)
    const authUser = await mockAuthService.signup(email, password);
    const dynamicUID = authUser.uID;

    // 2. Cria o usuário no repositório vinculado a esse ID
    const user = { ...mockUserData, uID: dynamicUID };
    await mockUserRepository.createUser(user);

    // 3. AJUSTE: Vincula os pets do mock ao novo ID dinâmico no repositório de pets
    // Isso simula que o usuário logado é o dono desses pets na base de dados
    const userMockPets = mockPets.filter(p => p.clientId === mockUserData.uID);
    for (const pet of userMockPets) {
      await mockPetRepository.createPet({
        ...pet,
        clientId: dynamicUID // Agora o pet pertence ao ID gerado no teste
      } as Pet);
    }

    // Act 1: Faz login
    const loggedUser = await authUseCases.login(email, password);

    // Assert 1
    expect(loggedUser).toBeDefined();
    expect(loggedUser.uID).toBe(dynamicUID);

    // Act 2: Busca os pets usando o ID logado
    const userPets = await petUseCases.getAllPetsByClientId(loggedUser.uID);

    // Assert 2
    expect(userPets).toBeDefined();
    expect(userPets.length).toBe(userMockPets.length);
    
    // Verifica se a consistência relacional foi mantida
    userPets.forEach((pet) => {
      expect(pet.clientId).toBe(loggedUser.uID);
    });
  });

  /**
   * Teste: Fluxo de busca de pet específico
   * Simula um usuário buscando um pet específico pelo ID
   * Usa os dados mockados do mockPets
   */
  it("deve permitir buscar um pet específico usando dados mockados", async () => {
    // Arrange: Usa dados do mockPets existente em /__test__/data
    const mockPet = mockPets[0]; // Rex, o primeiro pet

    // Act: Busca o pet pelo ID
    const pet = await petUseCases.getPetById(mockPet.id);

    // Assert: Verifica se o pet foi encontrado com os dados corretos
    expect(pet).not.toBeNull();
    expect(pet?.id).toBe(mockPet.id);
    expect(pet?.name).toBe(mockPet.name);
    expect(pet?.breed).toBe(mockPet.breed);
    expect(pet?.age).toBe(mockPet.age);
  });

  /**
   * Teste: Fluxo de validação de pets do usuário
   * Verifica se os pets retornados correspondem aos dados mockados
   */
  it("deve retornar pets com dados consistentes dos mocks", async () => {
    // Arrange: Usa o clientId do mockUser
    const mockUserData = mockUser[0];
    const clientId = mockUserData.uID;

    // Act: Busca todos os pets do cliente
    const pets = await petUseCases.getAllPetsByClientId(clientId);

    // Assert: Verifica se os pets correspondem aos dados mockados
    expect(pets.length).toBeGreaterThan(0);
    
    // Verifica se pelo menos um dos pets mockados está na lista
    const petNames = pets.map(p => p.name);
    const mockPetNames = mockPets
      .filter(p => p.clientId === clientId)
      .map(p => p.name);
    
    // Verifica se os nomes dos pets mockados estão presentes
    mockPetNames.forEach(mockName => {
      expect(petNames).toContain(mockName);
    });
  });
});
