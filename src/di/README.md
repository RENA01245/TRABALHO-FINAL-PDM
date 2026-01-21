# Sistema de Injeção de Dependência (DI)

Este diretório contém o sistema de Injeção de Dependência da aplicação PetCare, que permite alternar facilmente entre dados mockados (para desenvolvimento/testes) e banco de dados real (Supabase).

## Como Funciona

O arquivo `container.ts` centraliza todas as dependências da aplicação. Ele permite alternar entre duas implementações:

1. **MOCKS**: Dados fake armazenados em memória (para desenvolvimento e testes)
2. **BANCO REAL**: Conexão com Supabase (para produção)

## Como Alternar Entre Mocks e Banco Real

Abra o arquivo `src/di/container.ts` e altere a constante `USE_MOCKS`:

```typescript
// Para usar MOCKS (dados fake)
const USE_MOCKS = true;

// Para usar BANCO DE DADOS REAL (Supabase)
const USE_MOCKS = false;
```

## O Que Está Configurado

### Repositórios
- ✅ **UserRepository**: Alterna entre MockUserRepository e SupabaseUserRepository
- ✅ **ServiceRepository**: Alterna entre MockServiceRepository e SupabaseServiceRepository
- ✅ **PetRepository**: Alterna entre MockPetRepository e SupabasePetRepository
- ✅ **ProductRepository**: Alterna entre MockProductRepository e SupabaseProductRepository

### Serviços
- ✅ **AuthService**: Alterna entre MockAuthService e SupabaseAuthService

### Use Cases
Todos os Use Cases são automaticamente configurados com as dependências corretas:
- ✅ **authUseCases**: Para autenticação de usuários
- ✅ **serviceUseCases**: Para gerenciamento de serviços
- ✅ **petUseCases**: Para gerenciamento de pets
- ✅ **productUseCases**: Para gerenciamento de produtos

## Como Usar nos Componentes

### ✅ CORRETO: Usar apenas os Use Cases

```typescript
// ✅ CORRETO - Importa do container
import { authUseCases, serviceUseCases } from '@/di/container';

// Usa os Use Cases
const user = await authUseCases.login(email, password);
const services = await serviceUseCases.getAllServices();
```

### ❌ ERRADO: Instanciar diretamente

```typescript
// ❌ ERRADO - Não faça isso!
import { MockServiceRepository } from '../../__test__/mocks/ServiceRepositoryMock';
import { SupabaseServiceRepository } from '../infra/repositories/supabaseServiceRepository';

// ❌ ERRADO - Não instancie diretamente
const repository = new MockServiceRepository();
const repository = new SupabaseServiceRepository();
```

### ❌ ERRADO: Usar dados mockados diretamente

```typescript
// ❌ ERRADO - Não faça isso!
import { mockUser } from '../../__test__/data/mockData';

// ❌ ERRADO - Não use dados mockados diretamente
const userName = mockUser[0].userName;
```

### ✅ CORRETO: Obter dados do usuário atual

```typescript
// ✅ CORRETO - Usa o sistema de DI
import { authUseCases } from '@/di/container';
import { useState, useEffect } from 'react';

const [currentUser, setCurrentUser] = useState<User | null>(null);

useEffect(() => {
  const unsubscribe = authUseCases.onAuthStateChanged((user) => {
    setCurrentUser(user);
  });
  return () => unsubscribe();
}, []);

// Agora pode usar currentUser que funciona tanto com mocks quanto com banco real
const userName = currentUser?.userName;
```

## Estrutura dos Mocks

Os mocks estão localizados em `__test__/mocks/`:

- `AuthServiceMock.ts`: Simula autenticação sem banco de dados
- `UserRepositoryMock.ts`: Simula repositório de usuários com dados em memória
- `ServiceRepositoryMock.ts`: Simula repositório de serviços com dados mockados
- `PetRepositoryMock.ts`: Simula repositório de pets com dados mockados
- `ProductRepositoryMock.ts`: Simula repositório de produtos com dados mockados

Os dados mockados estão em `__test__/data/mockData.ts`:
- `mockUser`: Array com usuários de exemplo
- `mockPets`: Array com pets de exemplo
- `mockServices`: Array com serviços de exemplo
- `mockProducts`: Array com produtos de exemplo

## Benefícios

1. **Desacoplamento**: Os componentes não precisam saber se estão usando mocks ou banco real
2. **Testabilidade**: Fácil de testar com dados controlados
3. **Desenvolvimento**: Pode desenvolver sem precisar do banco configurado
4. **Flexibilidade**: Alterna entre ambientes com uma única mudança
5. **Manutenibilidade**: Centraliza toda a configuração de dependências

## Adicionando Novos Repositórios/Serviços

Para adicionar um novo repositório ou serviço:

1. **Crie a interface** em `src/model/repositories/` ou `src/model/services/`
2. **Crie a implementação real** em `src/infra/repositories/` ou `src/infra/services/`
3. **Crie o mock** em `__test__/mocks/`
4. **Adicione no container.ts**:
   ```typescript
   // Importe as implementações
   import { SupabaseNovoRepository } from "../infra/repositories/supabaseNovoRepository";
   import { MockNovoRepository } from "../../__test__/mocks/NovoRepositoryMock";
   
   // Adicione a variável
   let novoRepository: INovoRepository;
   
   // Adicione na lógica de alternância
   if (USE_MOCKS) {
     novoRepository = new MockNovoRepository();
   } else {
     novoRepository = new SupabaseNovoRepository();
   }
   
   // Crie o Use Case e exporte
   let novoUseCases = new NovoUseCases(novoRepository);
   export { novoUseCases };
   ```

## Notas Importantes

- ⚠️ **NUNCA** instancie repositórios ou serviços diretamente nos ViewModels ou componentes
- ⚠️ **SEMPRE** use os Use Cases exportados do container
- ⚠️ **NUNCA** importe dados mockados diretamente nos componentes de produção
- ✅ **SEMPRE** use `authUseCases.onAuthStateChanged()` para obter o usuário atual
- ✅ **SEMPRE** use os Use Cases para todas as operações de dados
