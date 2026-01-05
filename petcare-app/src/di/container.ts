import { SupabaseUserRepository } from "../infra/repositories/supabaseUserRepository";
import { SupabaseAuthService } from "../infra/services/supabase/supabaseAuthService";
import { SupabaseServiceRepository } from "../infra/repositories/supabaseServiceRepository";
import { SupabasePetRepository } from "../infra/repositories/supabasePetRepository";
import { SupabaseProductRepository } from "../infra/repositories/supabaseProductRepository";

import { IUserRepository } from "../model/repositories/iUserRepository";
import { IAuthService } from "../model/services/iAuthService";
import { IServiceRepository } from "../model/repositories/iServiceRepository";
import { IPetRepository } from "../model/repositories/iPetRepository";
import { IProductRepository } from "../model/repositories/iProductRepository";

import AuthUseCases from "../usecase/auth/authUseCases";
import { IAuthUseCases } from "../usecase/auth/iAuthUseCases";
import { ServiceUseCases } from "../usecase/service/serviceUseCases";
import { IServiceUseCases } from "../usecase/service/iServiceUseCases";
import { PetUseCases } from "../usecase/pet/petUseCases";
import { IPetUseCases } from "../usecase/pet/iPetUseCases";
import { ProductUseCases } from "../usecase/product/productUseCases";
import { IProductUseCases } from "../usecase/product/iProductUseCases";

// Imports dos Mocks
import { MockPetRepository } from "../../__test__/PetRepositoryMock";
import { MockServiceRepository } from "../../__test__/ServiceRepositoryMock";

// ---------------------------------------------------------
// CONFIGURAÇÃO DE AMBIENTE
// Altere para false para usar o banco real (Supabase)
const isMock = true; 
// ---------------------------------------------------------

// Inicialização das variáveis de contrato
let authService: IAuthService = new SupabaseAuthService();
let userRepository: IUserRepository = new SupabaseUserRepository();

let serviceRepository: IServiceRepository;
let petRepository: IPetRepository;
let productRepository: IProductRepository;

// Lógica de Alternância
if (isMock) {
  serviceRepository = new MockServiceRepository();
  petRepository = new MockPetRepository();
  // Se tiver MockProductRepository, adicione aqui, caso contrário mantém Supabase
  productRepository = new SupabaseProductRepository(); 
} else {
  serviceRepository = new SupabaseServiceRepository();
  petRepository = new SupabasePetRepository();
  productRepository = new SupabaseProductRepository();
}

// Injeção nos Casos de Uso (Eles não precisam saber se é Mock ou Real)
let authUseCases: IAuthUseCases = new AuthUseCases(authService, userRepository);
let serviceUseCases: IServiceUseCases = new ServiceUseCases(serviceRepository);
let petUseCases: IPetUseCases = new PetUseCases(petRepository);
let productUseCases: IProductUseCases = new ProductUseCases(productRepository);

export { authUseCases, serviceUseCases, petUseCases, productUseCases };