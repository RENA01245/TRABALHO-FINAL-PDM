# 🐾 PetCare App - Documentação Técnica Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Tecnologias e Versões](#tecnologias-e-versões)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Arquitetura](#arquitetura)
5. [Instalação e Execução](#instalação-e-execução)
6. [Dependências e Funcionalidades](#dependências-e-funcionalidades)
7. [Fluxo de Dados](#fluxo-de-dados)
8. [Componentes e Telas](#componentes-e-telas)
9. [Context API - Gerenciamento de Estado](#context-api---gerenciamento-de-estado)
10. [Navegação](#navegação)
11. [Dados Mockados](#dados-mockados)
12. [Funcionalidades Implementadas](#funcionalidades-implementadas)
13. [Deep Link WhatsApp](#deep-link-whatsapp)
14. [Extensibilidade](#extensibilidade)

---

## 🎯 Visão Geral

**PetCare** é um aplicativo mobile desenvolvido em **React Native** com **TypeScript**, utilizando **Expo SDK 54** e seguindo uma **arquitetura limpa** com separação de responsabilidades. O projeto foi desenvolvido para demonstração de fluxo e apresentação, utilizando dados mockados e sem integração com backend real.

### Características Principais

- ✅ **Arquitetura Limpa**: Separação clara entre camadas (view, model, infra, usecase)
- ✅ **TypeScript**: Tipagem completa em todo o código
- ✅ **Context API**: Gerenciamento de estado global para o carrinho
- ✅ **React Navigation**: Navegação completa com Bottom Tabs e Stack
- ✅ **Dados Mockados**: Todos os dados são simulados para demonstração
- ✅ **Deep Link**: Integração com WhatsApp para envio de pedidos

---

## 🛠 Tecnologias e Versões

### Core

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **React Native** | 0.81.5 | Framework mobile multiplataforma |
| **React** | 19.1.0 | Biblioteca base para UI |
| **TypeScript** | 5.9.2 | Tipagem estática |
| **Expo** | ~54.0.0 | SDK e ferramentas de desenvolvimento |

### Navegação

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **@react-navigation/native** | ^6.1.18 | Biblioteca principal de navegação |
| **@react-navigation/bottom-tabs** | ^6.6.1 | Navegação por abas inferiores |
| **@react-navigation/stack** | ^6.4.1 | Navegação em pilha (stack) |
| **react-native-safe-area-context** | ~5.6.0 | Gerenciamento de áreas seguras |
| **react-native-screens** | ~4.16.0 | Otimização de telas nativas |

### UI e Ícones

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **@expo/vector-icons** | ^15.0.3 | Biblioteca de ícones (Ionicons) |
| **expo-status-bar** | ~3.0.9 | Controle da barra de status |

### Desenvolvimento

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **@types/react** | ~19.1.10 | Tipos TypeScript para React |
| **jest** | ~29.7.0 | Framework de testes |
| **eslint** | ^7.14.0 | Linter de código |

---

## 📁 Estrutura do Projeto

```
petcare-app/
├── App.tsx                          # Ponto de entrada na raiz (obrigatório para Expo)
├── package.json                     # Dependências e scripts
├── app.json                         # Configuração do Expo
├── tsconfig.json                    # Configuração TypeScript
│
└── src/
    ├── App.tsx                      # Componente raiz da aplicação
    │
    ├── context/                     # Gerenciamento de Estado Global
    │   └── CartContext.tsx         # Context API para carrinho de compras
    │
    ├── data/                        # Dados Mockados
    │   └── mockData.ts             # Produtos, serviços, pets e usuário fictícios
    │
    ├── navigation/                  # Configuração de Navegação
    │   └── RootNavigator.tsx       # Rotas principais e navegação
    │
    ├── view/                        # Camada de Apresentação
    │   ├── components/             # Componentes Reutilizáveis
    │   │   ├── Banner.tsx
    │   │   ├── CartTabIcon.tsx
    │   │   ├── Header.tsx
    │   │   ├── PetCard.tsx
    │   │   ├── PetTrackingCard.tsx
    │   │   ├── SearchBar.tsx
    │   │   └── ServiceCard.tsx
    │   │
    │   └── screens/                # Telas da Aplicação
    │       ├── CartScreen.tsx
    │       ├── HomeScreen.tsx
    │       ├── OrderTrackingScreen.tsx
    │       ├── PetDetailsScreen.tsx
    │       ├── ProductDetailsScreen.tsx
    │       ├── ServicesScreen.tsx
    │       └── SettingsScreen.tsx
    │
    ├── model/                       # Camada de Domínio (Arquitetura Limpa)
    │   ├── entities/               # Entidades de domínio
    │   ├── errors/                 # Erros customizados
    │   ├── repositories/           # Interfaces de repositórios
    │   └── services/               # Interfaces de serviços
    │
    ├── infra/                       # Camada de Infraestrutura
    │   ├── repositories/           # Implementações de repositórios
    │   └── services/               # Implementações de serviços
    │
    ├── usecase/                     # Casos de Uso (Regras de Negócio)
    │   ├── auth/                   # Casos de uso de autenticação
    │   └── validator/              # Validações
    │
    └── di/                          # Injeção de Dependências
        └── container.ts
```

---

## 🏗 Arquitetura

### Padrão Arquitetural: Clean Architecture

O projeto segue os princípios da **Clean Architecture**, separando o código em camadas bem definidas:

```
┌─────────────────────────────────────┐
│         VIEW (Apresentação)         │
│  - Components                        │
│  - Screens                          │
│  - Navigation                       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      CONTEXT (Estado Global)         │
│  - CartContext                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      USECASE (Regras de Negócio)    │
│  - Auth Use Cases                   │
│  - Validators                       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        MODEL (Domínio)              │
│  - Entities                         │
│  - Interfaces                      │
│  - Errors                          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      INFRA (Infraestrutura)         │
│  - Repositories                    │
│  - Services                        │
└─────────────────────────────────────┘
```

### Princípios Aplicados

1. **Separação de Responsabilidades**: Cada camada tem uma responsabilidade única
2. **Inversão de Dependências**: Camadas superiores não dependem de implementações concretas
3. **Independência de Framework**: A lógica de negócio não depende do React Native
4. **Testabilidade**: Estrutura facilita testes unitários

---

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js** 18 ou superior
- **npm** ou **yarn**
- **Expo Go** instalado no dispositivo móvel (para testes)

### Passo 1: Navegar para o Diretório

```bash
   cd petcare-app
   ```

⚠️ **IMPORTANTE**: Sempre execute os comandos dentro da pasta `petcare-app/`, não na pasta pai.

### Passo 2: Instalar Dependências

```bash
   npm install
   ```

Este comando instala todas as dependências listadas no `package.json`.

### Passo 3: Corrigir Versões do Expo

```bash
npx expo install --fix
```

Este comando garante que todas as dependências estão compatíveis com Expo SDK 54.

### Passo 4: Iniciar o Servidor de Desenvolvimento

```bash
npm start
```

Ou com cache limpo:

```bash
npx expo start --clear
```

### Passo 5: Testar no Dispositivo

1. **Android**: Abra o app Expo Go → Toque em "Scan QR code" → Escaneie o QR code
2. **iOS**: Abra a Câmera → Aponte para o QR code → Toque na notificação

### Scripts Disponíveis

```json
{
  "start": "expo start",              // Inicia o Metro Bundler
  "android": "expo start --android",  // Abre no emulador Android
  "ios": "expo start --ios",          // Abre no simulador iOS (macOS)
  "web": "expo start --web",          // Abre no navegador
  "test": "jest",                      // Executa testes
  "lint": "eslint ."                  // Verifica código
}
```

---

## 📦 Dependências e Funcionalidades

### Dependências Principais

#### `@react-navigation/native` (^6.1.18)
**Função**: Biblioteca principal de navegação para React Native.

**Uso no Projeto**:
- Base para toda a navegação
- Fornece `NavigationContainer` que envolve toda a aplicação
- Gerencia o estado de navegação

**Exemplo de Uso**:
```typescript
import { NavigationContainer } from '@react-navigation/native';
```

#### `@react-navigation/bottom-tabs` (^6.6.1)
**Função**: Implementa navegação por abas na parte inferior da tela.

**Uso no Projeto**:
- Cria as 5 abas principais: Home, Shop, Services, Cart, Profile
- Configura ícones e cores personalizadas
- Gerencia a navegação entre as principais seções

**Exemplo de Uso**:
```typescript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
```

#### `@react-navigation/stack` (^6.4.1)
**Função**: Implementa navegação em pilha (stack) para telas modais e detalhes.

**Uso no Projeto**:
- Navegação para detalhes de produtos
- Navegação para acompanhamento de pedidos
- Permite voltar com botão nativo

**Exemplo de Uso**:
```typescript
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
```

#### `react-native-safe-area-context` (~5.6.0)
**Função**: Garante que o conteúdo não fique sobreposto por áreas seguras (notch, status bar).

**Uso no Projeto**:
- Usado implicitamente pelo `SafeAreaView` em todas as telas
- Previne que conteúdo fique escondido atrás do notch ou status bar

#### `react-native-screens` (~4.16.0)
**Função**: Otimiza o desempenho das telas usando componentes nativos.

**Uso no Projeto**:
- Melhora performance da navegação
- Reduz uso de memória
- Transições mais suaves

#### `@expo/vector-icons` (^15.0.3)
**Função**: Biblioteca de ícones incluindo Ionicons, MaterialIcons, etc.

**Uso no Projeto**:
- Ícones em toda a aplicação
- Ícones de navegação
- Ícones de serviços e produtos

**Exemplo de Uso**:
```typescript
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="home" size={24} color="#4CAF50" />
```

---

## 🔄 Fluxo de Dados

### Fluxo Geral da Aplicação

```
App.tsx (Raiz)
  │
  ├── CartProvider (Context API)
  │   └── Gerencia estado global do carrinho
  │
  └── RootNavigator
      │
      ├── HomeStack
      │   ├── HomeScreen
      │   │   ├── Usa: mockData (serviços)
      │   │   ├── Usa: CartContext (badge)
      │   │   └── Navega para: OrderTracking
      │   └── OrderTrackingScreen
      │
      ├── ShopStack
      │   ├── ShopScreen
      │   │   ├── Usa: mockData (produtos)
      │   │   ├── Usa: CartContext (addItem)
      │   │   └── Navega para: ProductDetails
      │   └── ProductDetailsScreen
      │       ├── Usa: CartContext (addItem com quantidade)
      │       └── Recebe: produto via route.params
      │
      ├── ServicesStack
      │   └── ServicesScreen
      │       ├── Usa: mockData (serviços, pets)
      │       ├── Usa: CartContext (addItem com petName)
      │       └── Modal para seleção de pet
      │
      ├── CartStack
      │   └── CartScreen
      │       ├── Usa: CartContext (items, updateQuantity, removeItem, getTotal)
      │       ├── Usa: mockUser (dados para WhatsApp)
      │       └── Deep Link: WhatsApp
      │
      └── Profile
          └── SettingsScreen
```

### Fluxo de Dados do Carrinho

```
1. Usuário adiciona item
   │
   ├── ShopScreen/ProductDetailsScreen/ServicesScreen
   │   └── Chama: addItem(item)
   │
   ├── CartContext
   │   ├── Verifica se item já existe
   │   ├── Se existe: incrementa quantidade
   │   └── Se não existe: adiciona novo item
   │
   └── Estado atualizado
       │
       ├── CartScreen: Exibe itens atualizados
       ├── CartTabIcon: Badge atualizado
       └── Todas as telas: Acesso ao estado global
```

---

## 🧩 Componentes e Telas

### Componentes Reutilizáveis (`src/view/components/`)

#### `Header.tsx`
**Função**: Cabeçalho da aplicação com saudação e campo de busca.

**Props**:
```typescript
interface HeaderProps {
  userName?: string;           // Nome do usuário
  searchValue?: string;        // Valor do campo de busca
  onSearchChange?: (text: string) => void;  // Callback de mudança
  onNotificationPress?: () => void;         // Callback de notificação
}
```

**Características**:
- Saudação personalizada
- Campo de busca integrado
- Ícone de notificação com badge

#### `SearchBar.tsx`
**Função**: Campo de busca reutilizável.

**Props**:
```typescript
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}
```

**Características**:
- Ícone de busca integrado
- Placeholder configurável
- Estilo consistente

#### `Banner.tsx`
**Função**: Banner promocional horizontal.

**Props**:
```typescript
interface BannerProps {
  imageUrl?: string;    // URL da imagem
  height?: number;      // Altura do banner
}
```

**Características**:
- Imagem configurável
- Altura customizável
- Bordas arredondadas e sombra

#### `ServiceCard.tsx`
**Função**: Card para exibir serviços.

**Props**:
```typescript
interface ServiceCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
}
```

**Características**:
- Ícone configurável
- Título com quebra de linha
- Feedback visual ao tocar

#### `PetTrackingCard.tsx`
**Função**: Card informativo para acompanhamento do pet.

**Props**:
```typescript
interface PetTrackingCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}
```

**Características**:
- Ícone, título e descrição
- Navegação opcional
- Ícone de chevron quando há descrição

#### `CartTabIcon.tsx`
**Função**: Ícone do carrinho com badge de quantidade.

**Props**:
```typescript
interface CartTabIconProps {
  focused: boolean;
  color: string;
  size: number;
}
```

**Características**:
- Badge dinâmico com quantidade
- Atualização automática via Context
- Estilo consistente com outros ícones

### Telas (`src/view/screens/`)

#### `HomeScreen.tsx`
**Função**: Tela inicial da aplicação.

**Funcionalidades**:
- Exibe saudação do usuário
- Campo de busca
- Banner promocional
- Grid de serviços (3 colunas)
- Card de acompanhamento do pet
- Navegação para outras telas

**Estado Local**:
```typescript
const [searchText, setSearchText] = useState('');
```

**Dados Utilizados**:
- `mockData.services` (para grid)
- `CartContext` (para badge)

#### `ShopScreen.tsx`
**Função**: Listagem de produtos disponíveis.

**Funcionalidades**:
- Lista produtos em grid (2 colunas)
- Exibe imagem, nome e preço
- Botão "Adicionar ao carrinho"
- Navegação para detalhes do produto

**Dados Utilizados**:
- `mockData.mockProducts`
- `CartContext.addItem()`

**Navegação**:
- Para `ProductDetails` ao tocar no produto

#### `ProductDetailsScreen.tsx`
**Função**: Detalhes completos de um produto.

**Funcionalidades**:
- Imagem ampliada
- Nome, preço e descrição
- Controle de quantidade (+/-)
- Botão "Adicionar ao carrinho"

**Estado Local**:
```typescript
const [quantity, setQuantity] = useState(1);
```

**Props Recebidas**:
```typescript
route.params.product: {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}
```

**Dados Utilizados**:
- `CartContext.addItem()` (com quantidade)

#### `ServicesScreen.tsx`
**Função**: Listagem e agendamento de serviços.

**Funcionalidades**:
- Lista serviços (Banho, Tosa, Consultas, Exames)
- Modal para seleção de pet
- Botão "Agendar" para cada serviço
- Adiciona serviço ao carrinho com pet selecionado

**Estado Local**:
```typescript
const [selectedPet, setSelectedPet] = useState(mockPets[0]);
const [showPetModal, setShowPetModal] = useState(false);
```

**Dados Utilizados**:
- `mockData.mockServices`
- `mockData.mockPets`
- `CartContext.addItem()` (com `petName`)

#### `CartScreen.tsx`
**Função**: Gerenciamento do carrinho de compras.

**Funcionalidades**:
- Lista todos os itens do carrinho
- Alterar quantidade de cada item
- Remover itens
- Cálculo automático do total
- Botão "Finalizar pedido via WhatsApp"
- Deep link do WhatsApp

**Dados Utilizados**:
- `CartContext.items`
- `CartContext.updateQuantity()`
- `CartContext.removeItem()`
- `CartContext.getTotal()`
- `mockData.mockUser`

**Deep Link WhatsApp**:
```typescript
const url = `whatsapp://send?phone=${phone}&text=${message}`;
Linking.openURL(url);
```

#### `OrderTrackingScreen.tsx`
**Função**: Acompanhamento do status do pedido.

**Funcionalidades**:
- Exibe status atual (Aguardando, Em atendimento, Finalizado)
- Timeline visual com 3 etapas
- Simulação de progresso
- Mensagem final quando concluído

**Estado Local**:
```typescript
const [currentStatus, setCurrentStatus] = useState<OrderStatus>('Aguardando');
```

**Status Possíveis**:
- `'Aguardando'`
- `'Em atendimento'`
- `'Finalizado'`

---

## 🗂 Context API - Gerenciamento de Estado

### `CartContext.tsx`

**Localização**: `src/context/CartContext.tsx`

**Função**: Gerencia o estado global do carrinho de compras.

### Interface do Context

```typescript
interface CartContextType {
  items: CartItem[];                                    // Lista de itens
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;                              // Calcula total
  getItemCount: () => number;                           // Conta itens (para badge)
}
```

### Interface do Item

```typescript
interface CartItem {
  id: string;              // Identificador único
  name: string;           // Nome do item
  price: number;          // Preço unitário
  quantity: number;       // Quantidade
  type: 'product' | 'service';  // Tipo do item
  image?: string;         // URL da imagem (opcional)
  petName?: string;      // Nome do pet (para serviços)
}
```

### Funcionalidades Implementadas

#### `addItem(item)`
**Função**: Adiciona um item ao carrinho ou incrementa quantidade se já existir.

**Lógica**:
1. Verifica se o item já existe no carrinho (por `id`)
2. Se existe: incrementa a quantidade
3. Se não existe: adiciona novo item com quantidade 1

**Exemplo**:
```typescript
addItem({
  id: '1',
  name: 'Comedouro automático',
  price: 99.99,
  type: 'product',
  image: 'https://...',
  quantity: 2
});
```

#### `removeItem(id)`
**Função**: Remove um item do carrinho.

**Lógica**:
- Filtra o array removendo o item com o `id` especificado

#### `updateQuantity(id, quantity)`
**Função**: Atualiza a quantidade de um item.

**Lógica**:
- Se `quantity <= 0`: remove o item
- Caso contrário: atualiza a quantidade

#### `getTotal()`
**Função**: Calcula o total do carrinho.

**Fórmula**:
```typescript
items.reduce((total, item) => total + item.price * item.quantity, 0)
```

#### `getItemCount()`
**Função**: Conta o total de itens (soma das quantidades).

**Fórmula**:
```typescript
items.reduce((count, item) => count + item.quantity, 0)
```

### Uso do Context

**Provider** (em `App.tsx`):
```typescript
<CartProvider>
  <RootNavigator />
</CartProvider>
```

**Hook** (em qualquer componente):
```typescript
const { items, addItem, getTotal } = useCart();
```

---

## 🧭 Navegação

### Estrutura de Navegação

O projeto utiliza uma combinação de **Bottom Tabs** e **Stack Navigation**:

```
NavigationContainer
  └── Tab.Navigator (Bottom Tabs)
      ├── HomeStack (Stack Navigator)
      │   ├── Home
      │   └── OrderTracking
      ├── ShopStack (Stack Navigator)
      │   ├── Shop
      │   └── ProductDetails
      ├── ServicesStack (Stack Navigator)
      │   └── Services
      ├── CartStack (Stack Navigator)
      │   └── Cart
      └── Profile (Screen direta)
          └── SettingsScreen
```

### Rotas Disponíveis

#### Bottom Tabs (5 abas)

1. **Home** (`HomeStack`)
   - Tela: `HomeScreen`
   - Ícone: `home` / `home-outline`
   - Stack: Pode navegar para `OrderTracking`

2. **Shop** (`ShopStack`)
   - Tela: `ShopScreen`
   - Ícone: `storefront` / `storefront-outline`
   - Stack: Pode navegar para `ProductDetails`

3. **Services** (`ServicesStack`)
   - Tela: `ServicesScreen`
   - Ícone: `calendar` / `calendar-outline`
   - Stack: Apenas uma tela

4. **Cart** (`CartStack`)
   - Tela: `CartScreen`
   - Ícone: `cart` / `cart-outline` (com badge)
   - Stack: Apenas uma tela

5. **Profile**
   - Tela: `SettingsScreen`
   - Ícone: `person` / `person-outline`
   - Screen direta (sem stack)

### Navegação Programática

**Exemplo de Navegação**:
```typescript
// Em qualquer componente dentro de um Stack
navigation.navigate('ProductDetails', { 
  product: selectedProduct 
});

// Navegação entre tabs
navigation.navigate('Cart');
```

### Configuração de Ícones

```typescript
tabBarIcon: ({ focused, color, size }) => {
  // Retorna componente Ionicons
  return <Ionicons name={iconName} size={size} color={color} />;
}}
```

**Cores**:
- Ativo: `#4CAF50` (verde)
- Inativo: `#999` (cinza)

---

## 📊 Dados Mockados

### Localização: `src/data/mockData.ts`

### Estrutura dos Dados

#### `mockProducts: Product[]`
**Quantidade**: 6 produtos

**Estrutura**:
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}
```

**Produtos Incluídos**:
1. Comedouro automático para cães - R$ 99,99
2. Brinquedo para cães - R$ 29,99
3. Cama para pets - R$ 149,99
4. Coleira ajustável - R$ 39,99
5. Ração Premium - R$ 89,99
6. Tapete higiênico - R$ 24,99

#### `mockServices: Service[]`
**Quantidade**: 8 serviços

**Estrutura**:
```typescript
interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}
```

**Serviços Incluídos**:
1. Banho - R$ 50,00
2. Tosa - R$ 60,00
3. Banho e Tosa - R$ 100,00
4. Consulta Veterinária - R$ 120,00
5. Exames Laboratoriais - R$ 150,00
6. Raio X - R$ 200,00
7. Cirurgia - R$ 500,00
8. Ultrasonografia - R$ 180,00

#### `mockPets: Pet[]`
**Quantidade**: 3 pets

**Estrutura**:
```typescript
interface Pet {
  id: string;
  name: string;
  type: string;
}
```

**Pets Incluídos**:
1. Rex - Cachorro
2. Mimi - Gato
3. Buddy - Cachorro

#### `mockUser`
**Estrutura**:
```typescript
{
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '5511999999999',
}
```

**Uso**: Dados do usuário para montar mensagem do WhatsApp.

---

## ⚙️ Funcionalidades Implementadas

### 1. Carrinho de Compras

**Localização**: `src/context/CartContext.tsx`

**Funcionalidades**:
- ✅ Adicionar produtos ao carrinho
- ✅ Adicionar serviços ao carrinho (com pet selecionado)
- ✅ Remover itens
- ✅ Alterar quantidade
- ✅ Calcular total automaticamente
- ✅ Contar itens (para badge)
- ✅ Estado global acessível em todas as telas

**Uso**:
```typescript
const { addItem, items, getTotal } = useCart();
```

### 2. Deep Link WhatsApp

**Localização**: `src/view/screens/CartScreen.tsx` (função `handleSendToWhatsApp`)

**Funcionalidades**:
- ✅ Monta mensagem automaticamente
- ✅ Inclui dados do cliente
- ✅ Lista produtos e serviços separadamente
- ✅ Mostra total do pedido
- ✅ Abre WhatsApp via deep link
- ✅ Trata erro se WhatsApp não estiver instalado

**Formato da Mensagem**:
```
*Pedido - PetCare*

*Cliente:* João Silva
*Telefone:* 5511999999999

*Itens do Pedido:*

*Produtos:*
• Comedouro automático x2 - R$ 199,98

*Serviços:*
• Banho (Rex) x1 - R$ 50,00

*Total: R$ 249,98*

Obrigado pela preferência! 🐾
```

**Implementação**:
```typescript
const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
Linking.canOpenURL(url).then(supported => {
  if (supported) {
    Linking.openURL(url);
  } else {
    Alert.alert('WhatsApp não instalado');
  }
});
```

### 3. Acompanhamento de Pedido

**Localização**: `src/view/screens/OrderTrackingScreen.tsx`

**Funcionalidades**:
- ✅ Timeline visual com 3 etapas
- ✅ Status mockado (Aguardando, Em atendimento, Finalizado)
- ✅ Simulação de progresso
- ✅ Mensagem final quando concluído
- ✅ Cores dinâmicas por status

**Status e Cores**:
- `Aguardando`: Laranja (#FF9500)
- `Em atendimento`: Azul (#2196F3)
- `Finalizado`: Verde (#4CAF50)

### 4. Busca

**Localização**: `src/view/screens/HomeScreen.tsx`

**Funcionalidades**:
- ✅ Campo de busca funcional
- ✅ Estado gerenciado localmente
- ✅ Pronto para implementação de filtro

**Estado**:
```typescript
const [searchText, setSearchText] = useState('');
```

### 5. Seleção de Pet

**Localização**: `src/view/screens/ServicesScreen.tsx`

**Funcionalidades**:
- ✅ Modal para seleção de pet
- ✅ Lista de pets mockados
- ✅ Indicação visual do pet selecionado
- ✅ Pet associado ao serviço no carrinho

---

## 🔗 Deep Link WhatsApp

### Implementação Técnica

**Biblioteca Utilizada**: `react-native` (Linking API nativa)

**Código**:
```typescript
import { Linking, Alert } from 'react-native';

const handleSendToWhatsApp = () => {
  const message = `*Pedido - PetCare*\n\n...`;
  const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
  
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert('WhatsApp não instalado');
      }
    })
    .catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    });
};
```

### Formato do Deep Link

```
whatsapp://send?phone=5511999999999&text=MENSAGEM_ENCODADA
```

**Parâmetros**:
- `phone`: Número de telefone (formato internacional)
- `text`: Mensagem codificada (URL encoded)

### Tratamento de Erros

1. **WhatsApp não instalado**: Mostra alerta informativo
2. **Erro de abertura**: Mostra alerta de erro genérico
3. **Carrinho vazio**: Valida antes de enviar

---

## 🔧 Extensibilidade

### Como Adicionar Nova Tela

1. **Criar arquivo da tela**:
```typescript
// src/view/screens/NovaTela.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NovaTela = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text>Nova Tela</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NovaTela;
```

2. **Adicionar rota no RootNavigator**:
```typescript
import NovaTela from '../view/screens/NovaTela';

// Adicionar no Stack ou Tab apropriado
<Stack.Screen name="NovaTela" component={NovaTela} />
```

### Como Adicionar Novo Produto

**Arquivo**: `src/data/mockData.ts`

```typescript
export const mockProducts: Product[] = [
  // ... produtos existentes
  {
    id: '7',
    name: 'Novo Produto',
    price: 79.99,
    image: 'https://via.placeholder.com/300x300?text=Novo+Produto',
    description: 'Descrição do novo produto.',
  },
];
```

### Como Adicionar Novo Serviço

**Arquivo**: `src/data/mockData.ts`

```typescript
export const mockServices: Service[] = [
  // ... serviços existentes
  {
    id: 's9',
    name: 'Novo Serviço',
    price: 80.00,
    description: 'Descrição do novo serviço.',
  },
];
```

### Como Adicionar Nova Funcionalidade ao Carrinho

**Arquivo**: `src/context/CartContext.tsx`

1. Adicionar função na interface:
```typescript
interface CartContextType {
  // ... funções existentes
  novaFuncao: () => void;
}
```

2. Implementar no Provider:
```typescript
const novaFuncao = () => {
  // Implementação
};
```

3. Adicionar ao value do Provider:
```typescript
value={{
  // ... valores existentes
  novaFuncao,
}}
```

### Como Adicionar Novo Componente

1. **Criar arquivo**:
```typescript
// src/view/components/NovoComponente.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NovoComponenteProps {
  title: string;
}

const NovoComponente: React.FC<NovoComponenteProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default NovoComponente;
```

2. **Usar em qualquer tela**:
```typescript
import NovoComponente from '../components/NovoComponente';

<NovoComponente title="Título" />
```

---

## 📝 Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (`HomeScreen.tsx`)
- **Arquivos**: PascalCase para componentes, camelCase para utilitários
- **Variáveis**: camelCase (`searchText`, `itemCount`)
- **Constantes**: UPPER_SNAKE_CASE (`MOCK_USER`)
- **Interfaces**: PascalCase com sufixo `Props` ou `Type` (`CartItem`, `HeaderProps`)

### Estrutura de Componente

```typescript
// 1. Imports
import React from 'react';
import { ... } from 'react-native';

// 2. Interfaces/Types
interface ComponentProps {
  // ...
}

// 3. Componente
const Component: React.FC<ComponentProps> = ({ ... }) => {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Funções
  const handleAction = () => {
    // ...
  };
  
  // 6. Render
  return (
    // JSX
  );
};

// 7. Styles
const styles = StyleSheet.create({
  // ...
});

// 8. Export
export default Component;
```

### TypeScript

- **Sempre tipar props**: `React.FC<Props>`
- **Sempre tipar estado**: `useState<string>('')`
- **Sempre tipar funções**: `(param: Type) => ReturnType`
- **Usar interfaces para objetos complexos**

---

## 🐛 Solução de Problemas Comuns

### Erro: "Unable to resolve module"
**Solução**:
```bash
rm -rf node_modules package-lock.json
npm install
npx expo install --fix
```

### Erro: "ConfigError: package.json not found"
**Solução**: Execute os comandos dentro de `petcare-app/`, não na pasta pai.

### Erro: "Cannot find module '@react-navigation/native'"
**Solução**:
```bash
npm install
npx expo install --fix
```

### App não atualiza após mudanças
**Solução**:
```bash
npx expo start --clear
```

### Erro de tipos TypeScript
**Solução**: Verifique se `@types/react` está compatível com a versão do React.

---

## 📚 Referências e Documentação

### Documentação Oficial

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

### Recursos Úteis

- [Expo Vector Icons](https://icons.expo.fyi/)
- [React Native Linking](https://reactnative.dev/docs/linking)

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração.

---

## 👥 Autores

Desenvolvido seguindo arquitetura limpa e boas práticas de React Native.

---

**Última atualização**: 2024
