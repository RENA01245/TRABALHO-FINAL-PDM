// model/entities/PetAttendance.ts
export type PetStatus = 
  | 'Aguardando' 
  | 'Em Banho' 
  | 'Na Tosa' 
  | 'Em Cirurgia' 
  | 'Recuperação' 
  | 'Em Consulta' 
  | 'Pronto';

export interface PetAttendance {
  id: string;          // ID do registro de atendimento (Primary Key)
  petId: string;       // FK - Vínculo com a tabela Pet
  clientId: string;    // FK - Vínculo com o Tutor (User) para segurança
  petName: string;     // Denormalização para facilitar exibição (UI)
  serviceName: string; // O serviço que está sendo prestado
  serviceId?: string;  // ID do serviço (opcional)
  status: PetStatus;   
  lastUpdate: Date;
}