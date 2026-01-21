import { IPetRepository } from "../../src/model/repositories/iPetRepository";
import Pet from "../../src/model/entities/pet";
import { mockPets } from "../../__test__/data/mockData";

/**
 * Mock do repositório de pets
 * Agora suporta manipulação de dados em memória para testes de integração
 */
export class MockPetRepository implements IPetRepository {
    updatePet(pet: Pet): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deletePet(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    // Iniciamos com os dados do mockData, mas permitimos que a lista cresça/mude durante o teste
    private pets: Pet[] = [...mockPets];

    async getPetById(id: string): Promise<Pet | null> {
        const pet = this.pets.find(p => p.id === id) || null;
        return Promise.resolve(pet);
    }

    async getAllPetsByClientId(clientId: string): Promise<Pet[]> {
        // Agora filtramos pelo clientId REAL passado por parâmetro
        return new Promise((resolve) => {
            const filtered = this.pets.filter(pet => pet.clientId === clientId);
            setTimeout(() => resolve(filtered), 100);
        });
    }

    /**
     * Adicionamos este método para que o teste de integração possa 
     * cadastrar um pet vinculado ao novo ID gerado dinamicamente
     */
    async createPet(pet: Pet): Promise<void> {
        return new Promise((resolve) => {
            this.pets.push(pet);
            setTimeout(() => resolve(), 100);
        });
    }

    /**
     * Opcional: Útil para garantir que um teste não interfira no outro
     */
    clear(): void {
        this.pets = [...mockPets];
    }
}