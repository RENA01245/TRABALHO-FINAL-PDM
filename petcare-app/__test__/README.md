# Testes da Aplicação PetCare

Este diretório contém os testes unitários e de integração da aplicação PetCare.

## Estrutura dos Testes

```
__test__/
├── data/              # Dados mockados para os testes
│   └── mockData.ts
├── mocks/             # Mocks de repositórios e serviços
│   ├── AuthServiceMock.ts
│   ├── ProductRepositoryMock.ts
│   └── UserRepositoryMock.ts
├── helpers/           # Funções auxiliares para testes
│   └── userHelper.ts
├── unit/              # Testes unitários
│   ├── AuthUseCases.test.ts
│   ├── AuthValidator.test.ts
│   ├── PetUseCases.test.ts
│   ├── ProductUseCases.test.ts
│   └── ServiceUseCases.test.ts
└── integration/      # Testes de integração
    ├── authFlow.test.ts
    ├── petFlow.test.ts
    ├── productFlow.test.ts
    ├── serviceFlow.test.ts
    └── userWithPetsFlow.test.ts
```

## Como Executar os Testes

### Instalar Dependências (se necessário)

Se você ainda não instalou as dependências de teste, execute:

```bash
npm install --save-dev @types/jest ts-jest
```

### Executar Todos os Testes

```bash
npm test
```

### Executar Testes Específicos

```bash
# Apenas testes unitários
npm test -- unit

# Apenas testes de integração
npm test -- integration

# Um arquivo específico
npm test -- AuthUseCases.test.ts
```

## Tipos de Testes

### Testes Unitários

Testam componentes individuais isoladamente, usando mocks para simular dependências:

- **ServiceUseCases.test.ts**: Testa a lógica de negócio relacionada a serviços
- **ProductUseCases.test.ts**: Testa a lógica de negócio relacionada a produtos
- **PetUseCases.test.ts**: Testa a lógica de negócio relacionada a pets
- **AuthUseCases.test.ts**: Testa a lógica de autenticação
- **AuthValidator.test.ts**: Testa as validações de dados de autenticação

### Testes de Integração

Testam fluxos completos, integrando múltiplos componentes:

- **authFlow.test.ts**: Testa o fluxo completo de autenticação (cadastro, login, logout) usando dados mockados
- **serviceFlow.test.ts**: Testa o fluxo completo de busca e visualização de serviços usando mockServices
- **productFlow.test.ts**: Testa o fluxo completo de busca e visualização de produtos usando mockProducts
- **petFlow.test.ts**: Testa o fluxo completo de busca e visualização de pets usando mockPets e mockUser
- **userWithPetsFlow.test.ts**: Testa o fluxo completo de usuário autenticado buscando seus pets usando dados mockados

## Mocks

Os mocks simulam os repositórios e serviços sem depender de bancos de dados ou serviços externos:

- **MockAuthService**: Simula o serviço de autenticação
- **MockUserRepository**: Simula o repositório de usuários
- **MockProductRepository**: Simula o repositório de produtos
- **MockServiceRepository**: Simula o repositório de serviços (já existente)
- **MockPetRepository**: Simula o repositório de pets (já existente)

## Comentários nos Testes

Todos os testes contêm comentários explicativos em português para facilitar a compreensão:

- **Arrange**: Prepara os dados e configurações necessárias
- **Act**: Executa a ação que está sendo testada
- **Assert**: Verifica se o resultado está correto

## Exemplo de Teste

```typescript
it("deve retornar todos os serviços disponíveis", async () => {
  // Arrange: Prepara o teste (já feito no beforeEach)
  
  // Act: Chama o método que queremos testar
  const services = await serviceUseCases.getAllServices();

  // Assert: Verifica se o resultado está correto
  expect(services).toHaveLength(mockServices.length);
  expect(services).toEqual(mockServices);
});
```

## Dados Mockados

Todos os testes utilizam os dados prontos da pasta `/__test__/data/mockData.ts`:

- **mockProducts**: Array com 6 produtos (comedouro, brinquedo, cama, coleira, ração, tapete)
- **mockServices**: Array com 8 serviços (banho, tosa, consulta veterinária, exames, etc.)
- **mockPets**: Array com 3 pets (Rex, Mimi, Buddy) associados a diferentes clientes
- **mockUser**: Array com 1 usuário (Gustavo Nery) que possui 2 pets

### Como os dados são usados:

- Os testes de **serviços** usam `mockServices` para validar buscas e filtros
- Os testes de **produtos** usam `mockProducts` para validar listagens e detalhes
- Os testes de **pets** usam `mockPets` e `mockUser` para validar relacionamentos
- Os testes de **autenticação** podem usar `mockUser` para simular usuários existentes

## Notas

- Os testes usam dados mockados do arquivo `mockData.ts` da pasta `/__test__/data`
- Cada teste é independente e não depende de outros testes
- Os mocks são resetados antes de cada teste (usando `beforeEach`)
- Todos os comentários nos testes indicam quando estão usando dados mockados
