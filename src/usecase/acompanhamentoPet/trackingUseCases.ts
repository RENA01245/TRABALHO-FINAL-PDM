import { PetAttendance } from "../../model/entities/petAttendance";
import { ITrackingRepository } from "../../model/repositories/iTrackingRepository";

export interface ITrackingUseCases {
  getPetTracking(clientId: string): Promise<PetAttendance[]>;
}

export class TrackingUseCases implements ITrackingUseCases {
  private repository: ITrackingRepository;

  constructor(repository: ITrackingRepository) {
    this.repository = repository;
  }

  async getPetTracking(clientId: string): Promise<PetAttendance[]> {
    return await this.repository.getTrackingByClientId(clientId);
  }
}