import Service from "../entities/service";

export interface IServiceRepository {
  getAllServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | null>;
}
