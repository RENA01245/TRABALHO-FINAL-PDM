import { IPetRepository } from "../src/model/repositories/iPetRepository";
import Pet from "../src/model/entities/pet";
import { mockPets, mockUser } from "../__test__/data/mockData";

export class MockPetRepository implements IPetRepository {
    getPetById(id: string): Promise<Pet | null> {
        const pet = mockPets.find(p => p.id === id) || null;
        return Promise.resolve(pet);
    }

    async getAllPetsByClientId(clientId: string): Promise<Pet[]> {
        // Usamos o ID do primeiro usuário do mock como padrão, 
        // ou o clientId passado se necessário.
        const targetClientId = mockUser[0].uID; 
        
        return new Promise((resolve) => {
        const filtered = mockPets.filter(pet => pet.clientId === targetClientId);
        setTimeout(() => resolve(filtered), 300);
        });
    }}