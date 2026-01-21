import Pet from "../../model/entities/pet";
import { IPetRepository } from "../../model/repositories/iPetRepository";

export interface IPetUseCases {
  getAllPetsByClientId(clientId: string): Promise<Pet[]>;
  getPetById(id: string): Promise<Pet | null>;
  createPet(pet: Pet): Promise<void>;
  updatePet(pet: Pet): Promise<void>;
  deletePet(id: string): Promise<void>;
}
