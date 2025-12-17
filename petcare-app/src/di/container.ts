import { SupabaseUserRepository } from "../infra/repositories/supabaseUserRepository";
import { SupabaseAuthService } from "../infra/services/supabase/supabaseAuthService";
import { IUserRepository } from "../model/repositories/iUserRepository";
import { IAuthService } from "../model/services/iAuthService";
import AuthUseCases from "../usecase/auth/authUseCases";
import { IAuthUseCases } from "../usecase/auth/iAuthUseCases";

let authService : IAuthService = new SupabaseAuthService();
let userRepository : IUserRepository = new SupabaseUserRepository();
let authUseCases : IAuthUseCases = new AuthUseCases(authService, userRepository);

export { authUseCases };