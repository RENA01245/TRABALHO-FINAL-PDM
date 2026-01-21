/**
 * Container de Injeção de Dependência (DI)
 * 
 * Este arquivo centraliza a configuração de todas as dependências da aplicação.
 * Permite alternar facilmente entre implementações mockadas (para testes/desenvolvimento)
 * e implementações reais (banco de dados Supabase).
 * 
 * COMO USAR:
 * 1. Para usar MOCKS (dados fake para desenvolvimento/testes):
 *    - Altere USE_MOCKS para true
 * 
 * 2. Para usar BANCO DE DADOS REAL (Supabase):
 *    - Altere USE_MOCKS para false
 * 
 * IMPORTANTE: Todos os ViewModels e componentes devem usar apenas os UseCases
 * exportados deste container, nunca instanciar repositórios ou serviços diretamente.
 */

// ============================================================
// CONFIGURAÇÃO DE AMBIENTE
// ============================================================
// Altere esta flag para alternar entre mocks e banco real
// true = usa mocks (dados fake) | false = usa banco real (Supabase)
const USE_MOCKS = false;
// ============================================================




// ============================================================
// IMPORTS - Implementações Reais (Banco de Dados)
// ============================================================
import { SupabaseUserRepository } from "../infra/repositories/supabaseUserRepository";
import { SupabaseAuthService } from "../infra/services/supabase/supabaseAuthService";
import { SupabaseServiceRepository } from "../infra/repositories/supabaseServiceRepository";
import { SupabasePetRepository } from "../infra/repositories/supabasePetRepository";
import { SupabaseProductRepository } from "../infra/repositories/supabaseProductRepository";
import { SupabaseTrackingRepository } from "../infra/repositories/supabaseTrackingRepository";

// ============================================================
// IMPORTS - Implementações Mockadas (Dados Fake)
// ============================================================
import { MockAuthService } from "../../__test__/mocks/AuthServiceMock";
import { MockUserRepository } from "../../__test__/mocks/UserRepositoryMock";
import { MockServiceRepository } from "../../__test__/mocks/ServiceRepositoryMock";
import { MockPetRepository } from "../../__test__/mocks/PetRepositoryMock";
import { MockProductRepository } from "../../__test__/mocks/ProductRepositoryMock";
import { MockTrackingRepository } from "../../__test__/mocks/TrackingRepositoryMock";

// ============================================================
// IMPORTS - Interfaces (Contratos)
// ============================================================
import { IUserRepository } from "../model/repositories/iUserRepository";
import { IAuthService } from "../model/services/iAuthService";
import { IServiceRepository } from "../model/repositories/iServiceRepository";
import { IPetRepository } from "../model/repositories/iPetRepository";
import { IProductRepository } from "../model/repositories/iProductRepository";
import { ITrackingRepository } from "../model/repositories/iTrackingRepository";

// ============================================================
// IMPORTS - Use Cases
// ============================================================
import AuthUseCases from "../usecase/auth/authUseCases";
import { IAuthUseCases } from "../usecase/auth/iAuthUseCases";
import { ServiceUseCases } from "../usecase/service/serviceUseCases";
import { IServiceUseCases } from "../usecase/service/iServiceUseCases";
import { PetUseCases } from "../usecase/pet/petUseCases";
import { IPetUseCases } from "../usecase/pet/iPetUseCases";
import { ProductUseCases } from "../usecase/product/productUseCases";
import { IProductUseCases } from "../usecase/product/iProductUseCases";
import { mockUser } from "../../__test__/data/mockData";
import { TrackingUseCases, ITrackingUseCases } from "../usecase/acompanhamentoPet/trackingUseCases";
import { TurboModuleRegistry } from "react-native";

// ============================================================
// INICIALIZAÇÃO DOS REPOSITÓRIOS E SERVIÇOS
// ============================================================
// Variáveis que armazenarão as instâncias (mockadas ou reais)
let authService: IAuthService;
let userRepository: IUserRepository;
let serviceRepository: IServiceRepository;
let petRepository: IPetRepository;
let productRepository: IProductRepository;
let trackingRepository: ITrackingRepository;

// ============================================================
// LÓGICA DE ALTERNÂNCIA ENTRE MOCKS E BANCO REAL
// ============================================================
if (USE_MOCKS) {
  const userMock = mockUser[0]
  // ============================================================
  // MODO MOCK: Usa implementações fake com dados mockados
  // ============================================================
  console.log("🔧 [DI] Usando MOCKS - Dados fake para desenvolvimento/testes");
  
  authService = new MockAuthService(userMock);
  userRepository = new MockUserRepository();

  userRepository.createUser(userMock)

  serviceRepository = new MockServiceRepository();
  petRepository = new MockPetRepository();
  productRepository = new MockProductRepository();
  trackingRepository = new MockTrackingRepository();
} else {
  // ============================================================
  // MODO REAL: Usa implementações reais com Supabase
  // ============================================================
  console.log("🗄️ [DI] Usando BANCO DE DADOS REAL - Supabase");
  
  authService = new SupabaseAuthService();
  userRepository = new SupabaseUserRepository();
  serviceRepository = new SupabaseServiceRepository();
  petRepository = new SupabasePetRepository();
  productRepository = new SupabaseProductRepository();
  trackingRepository = new SupabaseTrackingRepository();
}

// ============================================================
// INJEÇÃO DE DEPENDÊNCIAS NOS USE CASES
// ============================================================
// Os UseCases recebem as dependências injetadas e não precisam
// saber se são mocks ou implementações reais. Isso permite
// testar facilmente e alternar entre ambientes.
let authUseCases: IAuthUseCases = new AuthUseCases(authService, userRepository);
let serviceUseCases: IServiceUseCases = new ServiceUseCases(serviceRepository);
let petUseCases: IPetUseCases = new PetUseCases(petRepository);
let productUseCases: IProductUseCases = new ProductUseCases(productRepository);
let trackingUseCases: ITrackingUseCases = new TrackingUseCases(trackingRepository);

// ============================================================
// EXPORTS
// ============================================================
// Exporta apenas os UseCases. NUNCA exporte repositórios ou
// serviços diretamente. Todos os componentes devem usar apenas
// os UseCases para manter o desacoplamento.
export { 
  authUseCases, 
  serviceUseCases, 
  petUseCases, 
  productUseCases,
  trackingUseCases
};

// ============================================================
// NOTAS IMPORTANTES:
// ============================================================
// 1. NUNCA instancie repositórios ou serviços diretamente nos
//    ViewModels ou componentes. Sempre use os UseCases deste container.
//
// 2. Para adicionar um novo repositório/serviço:
//    a) Crie a interface no model/repositories ou model/services
//    b) Crie a implementação real em infra/repositories ou infra/services
//    c) Crie o mock em __test__/mocks
//    d) Adicione a lógica de alternância aqui
//    e) Crie o UseCase correspondente
//    f) Exporte o UseCase
//
// 3. Para obter dados do usuário atual, use authUseCases ao invés
//    de acessar mockUser diretamente. Isso garante que funcione
//    tanto com mocks quanto com banco real.
