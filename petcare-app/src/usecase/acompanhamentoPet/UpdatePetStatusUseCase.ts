// usecase/acompanhamentoPet/UpdatePetStatusUseCase.ts
import { ITrackingRepository } from "../../model/repositories/iTrackingRepository";
import { PetStatus } from "../../model/entities/petAttendance";

export class UpdatePetStatusUseCase {
  constructor(private repository: ITrackingRepository) {}

  async execute(matricula: string, status: PetStatus): Promise<void> {
    if (!matricula) throw new Error("A matrícula é obrigatória.");
    return await this.repository.updateStatusByPetMatricula(matricula, status);
  }
}