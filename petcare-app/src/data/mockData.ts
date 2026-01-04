export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Comedouro automático para cães',
    price: 99.99,
    image: 'https://via.placeholder.com/300x300?text=Comedouro+Automatico',
    description: 'Comedouro automático com timer para alimentação programada do seu pet.',
  },
  {
    id: '2',
    name: 'Brinquedo para cães',
    price: 29.99,
    image: 'https://via.placeholder.com/300x300?text=Brinquedo+Cao',
    description: 'Brinquedo resistente e durável para entreter seu cão.',
  },
  {
    id: '3',
    name: 'Cama para pets',
    price: 149.99,
    image: 'https://via.placeholder.com/300x300?text=Cama+Pet',
    description: 'Cama confortável e macia para seu pet descansar.',
  },
  {
    id: '4',
    name: 'Coleira ajustável',
    price: 39.99,
    image: 'https://via.placeholder.com/300x300?text=Coleira',
    description: 'Coleira resistente e ajustável para passeios seguros.',
  },
  {
    id: '5',
    name: 'Ração Premium',
    price: 89.99,
    image: 'https://via.placeholder.com/300x300?text=Racao+Premium',
    description: 'Ração premium com todos os nutrientes necessários.',
  },
  {
    id: '6',
    name: 'Tapete higiênico',
    price: 24.99,
    image: 'https://via.placeholder.com/300x300?text=Tapete+Higienico',
    description: 'Tapete higiênico absorvente e descartável.',
  },
];

export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Banho',
    price: 50.00,
    description: 'Banho completo com produtos de qualidade.',
  },
  {
    id: 's2',
    name: 'Tosa',
    price: 60.00,
    description: 'Tosa profissional para seu pet.',
  },
  {
    id: 's3',
    name: 'Banho e Tosa',
    price: 100.00,
    description: 'Pacote completo: banho + tosa.',
  },
  {
    id: 's4',
    name: 'Consulta Veterinária',
    price: 120.00,
    description: 'Consulta completa com veterinário especializado.',
  },
  {
    id: 's5',
    name: 'Exames Laboratoriais',
    price: 150.00,
    description: 'Pacote de exames laboratoriais completos.',
  },
  {
    id: 's6',
    name: 'Raio X',
    price: 200.00,
    description: 'Exame de raio X para diagnóstico.',
  },
  {
    id: 's7',
    name: 'Cirurgia',
    price: 500.00,
    description: 'Procedimento cirúrgico com anestesia.',
  },
  {
    id: 's8',
    name: 'Ultrasonografia',
    price: 180.00,
    description: 'Exame de ultrassom para diagnóstico.',
  },
];

export const mockPets: Pet[] = [
  { id: 'p1', name: 'Rex', type: 'Cachorro' },
  { id: 'p2', name: 'Mimi', type: 'Gato' },
  { id: 'p3', name: 'Buddy', type: 'Cachorro' },
];

export const mockUser = {
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '5511999999999',
};

