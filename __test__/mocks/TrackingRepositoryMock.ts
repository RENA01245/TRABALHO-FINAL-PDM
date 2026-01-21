import { ITrackingRepository } from "../../src/model/repositories/iTrackingRepository";
import { PetAttendance, PetStatus } from "../../src/model/entities/petAttendance";
import { mockAttendances } from "../data/mockData";

/**
 * Mock do repositório de acompanhamento
 * Simula a persistência de status de atendimentos em memória
 */
export class MockTrackingRepository implements ITrackingRepository {
  // Dados iniciais para teste
  /**
   * Simula a busca de atendimentos de pets vinculados a um tutor
   */
  async getTrackingByClientId(clientId: string): Promise<PetAttendance[]> {
    return new Promise((resolve) => {
      // Nota: Em um sistema real, aqui haveria um JOIN entre Pet e Attendance 
      // ou uma filtragem baseada nos IDs dos pets que pertencem ao clientId.
      // Para o mock, vamos retornar os dados existentes com um pequeno delay.
      setTimeout(() => resolve(mockAttendances), 300);
    });
  }

  /**
   * Simula a função que o FUNCIONÁRIO usará
   * Filtra pela matrícula do pet e altera o status
   */
  async updateStatusByPetMatricula(matricula: string, novoStatus: PetStatus): Promise<void> {
    return new Promise((resolve, reject) => {
      // No mock, estamos usando o petName como "matricula" simplificada para o exemplo,
      // ou você pode buscar o pet real para validar a matrícula antes.
      const attendance = mockAttendances.find(a => a.petId === matricula || a.petName === matricula);

      if (attendance) {
        attendance.status = novoStatus;
        attendance.lastUpdate = new Date();
        console.log(`✅ [Mock] Status de ${attendance.petName} atualizado para: ${novoStatus}`);
        setTimeout(resolve, 100);
      } else {
        console.error(`❌ [Mock] Pet com matrícula/id ${matricula} não encontrado.`);
        reject(new Error("Pet não encontrado para atualização"));
      }
    });
  }

  /**
   * Permite adicionar um novo atendimento durante os testes
   */
  async createAttendance(attendance: PetAttendance): Promise<void> {
    mockAttendances.push(attendance);
    return Promise.resolve();
  }
}