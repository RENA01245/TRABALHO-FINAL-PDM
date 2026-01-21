import Service from "../../model/entities/service";
import { IServiceRepository } from "../../model/repositories/iServiceRepository";
import { IServiceUseCases } from "./iServiceUseCases";

export class ServiceUseCases implements IServiceUseCases {
  private serviceRepository: IServiceRepository;

  constructor(serviceRepository: IServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async getAllServices(): Promise<Service[]> {
    return this.serviceRepository.getAllServices();
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.serviceRepository.getServiceById(id);
  }
}
