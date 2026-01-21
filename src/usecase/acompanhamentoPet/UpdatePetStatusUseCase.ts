// usecase/acompanhamentoPet/UpdatePetStatusUseCase.ts
import { ITrackingRepository } from "../../model/repositories/iTrackingRepository";
import { PetStatus } from "../../model/entities/petAttendance";

export class UpdatePetStatusUseCase {
  constructor(private repository: ITrackingRepository) {}

  async execute(matricula: string, status: PetStatus): Promise<void> {
    if (!matricula) throw new Error("A matrícula é obrigatória.");
    
    // Aqui você poderia adicionar regras de negócio, como:
    // "Não permitir que um pet finalizado volte para status 'Em Banho'"
    
    return await this.repository.updateStatusByPetMatricula(matricula, status);
  }
}