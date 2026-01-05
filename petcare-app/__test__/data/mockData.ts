import  Product  from '../../src/model/entities/product';
import  Service  from '../../src/model/entities/service';
import  Pet  from '../../src/model/entities/pet';
import  User  from '../../src/model/entities/user';
// import { User } from '@supabase/supabase-js';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Comedouro automático para cães',
    description: 'Comedouro automático com timer para alimentação programada do seu pet.',
    price: 99.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Comedouro+Automatico',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Brinquedo para cães',
    description: 'Brinquedo resistente e durável para entreter seu cão.',
    price: 29.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Brinquedo+Cao',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Cama para pets',
    description: 'Cama confortável e macia para seu pet descansar.',
    price: 149.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Cama+Pet',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Coleira ajustável',
    description: 'Coleira resistente e ajustável para passeios seguros.',
    price: 39.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Coleira',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Ração Premium',
    description: 'Ração premium com todos os nutrientes necessários.',
    price: 89.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Racao+Premium',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Tapete higiênico',
    description: 'Tapete higiênico absorvente e descartável.',
    price: 24.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Tapete+Higienico',
    createdAt: new Date().toISOString(),
  },
];


export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Banho',
    description: 'Banho completo com produtos de qualidade.',
    price: 50.0,
    estimatedDuration: 60,
    type: 'service',
  },
  {
    id: 's2',
    name: 'Tosa',
    description: 'Tosa profissional para seu pet.',
    price: 60.0,
    estimatedDuration: 60,
    type: 'service',
  },
  {
    id: 's3',
    name: 'Banho e Tosa',
    description: 'Pacote completo: banho + tosa.',
    price: 100.0,
    estimatedDuration: 120,
    type: 'service',
  },
  {
    id: 's4',
    name: 'Consulta Veterinária',
    description: 'Consulta completa com veterinário especializado.',
    price: 120.0,
    estimatedDuration: 45,
    type: 'consultation',
  },
  {
    id: 's5',
    name: 'Exames Laboratoriais',
    description: 'Pacote de exames laboratoriais completos.',
    price: 150.0,
    estimatedDuration: 90,
    type: 'exam',
  },
  {
    id: 's6',
    name: 'Raio X',
    description: 'Exame de raio X para diagnóstico.',
    price: 200.0,
    estimatedDuration: 30,
    type: 'exam',
  },
  {
    id: 's7',
    name: 'Cirurgia',
    description: 'Procedimento cirúrgico com anestesia.',
    price: 500.0,
    estimatedDuration: 240,
    type: 'procedure',
  },
  {
    id: 's8',
    name: 'Ultrasonografia',
    description: 'Exame de ultrassom para diagnóstico.',
    price: 180.0,
    estimatedDuration: 40,
    type: 'exam',
  },
];


export const mockPets: Pet[] = [
  {
    id: 'p1',
    clientId: 'u1',
    name: 'Rex',
    breed: 'Labrador',
    age: 5,
    observations: 'Muito dócil e brincalhão',
  },
  {
    id: 'p2',
    clientId: 'u1',
    name: 'Mimi',
    breed: 'Siamês',
    age: 3,
    observations: null,
  },
  {
    id: 'p3',
    clientId: 'u2',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 2,
    observations: 'Precisa de atenção com alimentação',
  },
];

export const mockUser: User[] = [
  {
    uID: 'u1',
    userName: 'Gustavo Nery',
    email: 'joao@email.com',
    telefone: '55 86 999048018',
    pets: [mockPets[0], mockPets[1]],
  }
];
