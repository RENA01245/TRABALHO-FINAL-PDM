import { PetAttendance } from "../entities/petAttendance";

export interface ITrackingRepository {
  // Busca todos os atendimentos ativos dos pets de um cliente
  getTrackingByClientId(clientId: string): Promise<PetAttendance[]>;
  
  // Método que o funcionário usará: atualiza status pela matrícula
  updateStatusByPetMatricula(matricula: string, status: string): Promise<void>;
}