import Service from "../../model/entities/service";
import { IServiceRepository } from "../../model/repositories/iServiceRepository";

export interface IServiceUseCases {
  getAllServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | null>;
}
