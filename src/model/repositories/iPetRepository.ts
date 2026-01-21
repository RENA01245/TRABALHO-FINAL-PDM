import Pet from "../entities/pet";

export interface IPetRepository {
  getAllPetsByClientId(clientId: string): Promise<Pet[]>;
  getPetById(id: string): Promise<Pet | null>;
  createPet(pet: Pet): Promise<void>;
  updatePet(pet: Pet): Promise<void>;
  deletePet(id: string): Promise<void>;
}
