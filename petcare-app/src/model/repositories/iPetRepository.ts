import Pet from "../entities/pet";

export interface IPetRepository {
  getAllPetsByClientId(clientId: string): Promise<Pet[]>;
  getPetById(id: string): Promise<Pet | null>;
}
