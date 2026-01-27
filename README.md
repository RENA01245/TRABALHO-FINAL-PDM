
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
10. [Estratégia de Testes](#estratégia-de-testes)

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

---

## 📁 Estrutura do Projeto

```
petcare-app/
├── App.tsx                          # Ponto de entrada na raiz
├── package.json                     # Dependências e scripts
├── app.json                         # Configuração do Expo
├── tsconfig.json                    # Configuração TypeScript
│
└── src/
    ├── context/                     # Gerenciamento de Estado Global
    │   └── CartContext.tsx
    │
    ├── data/                        # Dados Mockados
    │
    ├── navigation/                  # Configuração de Navegação
    │   └── RootNavigator.tsx
    │
    ├── view/                        # Camada de Apresentação
    │   ├── components/
    │   └── screens/
    │
    ├── model/                       # Camada de Domínio (Arquitetura Limpa)
    │   ├── entities/
    │   ├── errors/
    │   ├── repositories/
    │   └── services/
    │
    ├── infra/                       # Camada de Infraestrutura
    │   ├── repositories/
    │   └── services/
    │
    ├── usecase/                     # Casos de Uso (Regras de Negócio)
    │   ├── auth/
    │   └── validator/
    │
    └── di/                          # Injeção de Dependências
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

---

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js** 18 ou superior
- **npm** ou **yarn**
- **Expo Go** instalado no dispositivo móvel (para testes)

### Comandos

```bash
# Instalar dependências
npm install

# Corrigir versões do Expo (se necessário)
npx expo install --fix

# Iniciar servidor
npm start
# ou
npx expo start --clear
```

---

## 🧪 Estratégia de Testes

A estratégia de testes do PetCare visa garantir a qualidade do código em diferentes níveis, assegurando que a lógica de negócio, a integração entre componentes e os fluxos críticos do usuário funcionem conforme esperado.

### Níveis de Teste

1.  **Testes Unitários (Jest + Testing Library)**
    *   **Foco**: Validar lógica de negócio isolada (ViewModels, UseCases, Validadores).
    *   **Cobertura Alvo**: Mínimo de 70% para classes com lógica de negócio.
    *   **Ferramentas**: Jest, React Testing Library.
    *   **Localização**: `__test__/unit/`

2.  **Testes de Integração**
    *   **Foco**: Validar a comunicação entre camadas (ViewModel ↔ UseCase ↔ Repository).
    *   **Cobertura Alvo**: Mínimo de 30% dos fluxos principais.
    *   **Abordagem**: Testar fluxos completos simulando interações reais, mas com mocks controlados para infraestrutura externa (ex: Supabase mockado).
    *   **Localização**: `__test__/integration/`

3.  **Testes End-to-End (E2E) (Playwright)**
    *   **Foco**: Validar fluxos críticos do ponto de vista do usuário final em um ambiente o mais próximo possível do real (Web/Mobile Web).
    *   **Ferramentas**: Playwright.
    *   **Localização**: `__test__/e2e/`

### TDD (Test Driven Development)

Duas funcionalidades chave foram desenvolvidas utilizando TDD (Red → Green → Refactor):

1.  **Validação de Senha Forte (`AuthValidator.ts`)**:
    *   **Problema**: Garantir segurança nas contas de usuário exigindo senhas complexas.
    *   **Implementação**: Criados testes para validar comprimento, letras maiúsculas/minúsculas, números e caracteres especiais antes da implementação da lógica.

2.  **Cálculo de Total do Carrinho (`CartCalculator.ts`)**:
    *   **Problema**: Garantir precisão no cálculo financeiro do carrinho, incluindo descontos.
    *   **Implementação**: Criados testes para soma de itens, aplicação de descontos percentuais e tratamento de casos de borda (carrinho vazio, descontos inválidos) antes da implementação.

### Testes E2E com Playwright

#### Funcionalidades Escolhidas

1.  **Fluxo de Autenticação (Login/Cadastro)**
    *   **Justificativa**: É a porta de entrada do aplicativo. Falhas aqui impedem o uso de qualquer outra funcionalidade. Testar E2E garante que a UI de login interage corretamente com o serviço de autenticação e navegação.

2.  **Fluxo de Compras (Loja → Carrinho → Checkout)**
    *   **Justificativa**: É o core business do app (venda de produtos/serviços). Envolve múltiplas telas (Listagem, Detalhes, Carrinho), persistência de estado (Context) e interação complexa (adicionar, remover, calcular). Testar E2E valida a integração visual e lógica de todo o processo de venda.

#### Instruções de Execução

**Executando Testes Unitários e de Integração**:
```bash
npm test
```

**Executando Testes E2E (Playwright)**:
*Nota: Como o projeto é Expo, os testes E2E com Playwright são configurados para rodar contra a versão Web do app.*

1.  Instale os navegadores:
    ```bash
    npx playwright install
    ```

2.  Execute os testes:
    ```bash
    npx playwright test
    ```
