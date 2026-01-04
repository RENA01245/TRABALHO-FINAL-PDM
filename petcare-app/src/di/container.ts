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


let authService: IAuthService = new SupabaseAuthService();
let userRepository: IUserRepository = new SupabaseUserRepository();
let serviceRepository: IServiceRepository = new SupabaseServiceRepository();
let petRepository: IPetRepository = new SupabasePetRepository();
let productRepository: IProductRepository = new SupabaseProductRepository();

let authUseCases: IAuthUseCases = new AuthUseCases(authService, userRepository);
let serviceUseCases: IServiceUseCases = new ServiceUseCases(serviceRepository);
let petUseCases: IPetUseCases = new PetUseCases(petRepository);
let productUseCases: IProductUseCases = new ProductUseCases(productRepository);


export { authUseCases, serviceUseCases, petUseCases, productUseCases };