import { IServiceRepository } from "../src/model/repositories/iServiceRepository";
import Service from "../src/model/entities/service";
import { mockServices } from "../__test__/data/mockData";
import { RepositoryError } from "../src/model/errors/repositoryError";

export class MockServiceRepository implements IServiceRepository {
  getAllServices(): Promise<Service[]> {
    try {
      return Promise.resolve([...mockServices]);
    } catch (error) {
      throw new RepositoryError('Falha ao obter todos os serviços');
    }
  }
  getServiceById(id: string): Promise<Service | null> {
    try {
      if (!id || id.trim() === '') {
        throw new RepositoryError('ID do serviço inválido');
      }
      const service = mockServices.find(s => s.id === id) || null;
      return Promise.resolve(service);
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError('Falha ao obter serviço por ID');
    }
  }
  async getAll(): Promise<Service[]> {
    try {
      return [...mockServices];
    } catch (error) {
      throw new RepositoryError('Falha ao obter todos os serviços');
    }
  }
}