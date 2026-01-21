import Pet from "../../model/entities/pet";
import { IPetRepository } from "../../model/repositories/iPetRepository";
import { IPetUseCases } from "./iPetUseCases";

export class PetUseCases implements IPetUseCases {
  private petRepository: IPetRepository;

  constructor(petRepository: IPetRepository) {
    this.petRepository = petRepository;
  }

  async getAllPetsByClientId(clientId: string): Promise<Pet[]> {
    return this.petRepository.getAllPetsByClientId(clientId);
  }

  async getPetById(id: string): Promise<Pet | null> {
    return this.petRepository.getPetById(id);
  }

  async createPet(pet: Pet): Promise<void> {
    return this.petRepository.createPet(pet);
  }

  async updatePet(pet: Pet): Promise<void> {
    return this.petRepository.updatePet(pet);
  }

  async deletePet(id: string): Promise<void> {
    return this.petRepository.deletePet(id);
  }
}
