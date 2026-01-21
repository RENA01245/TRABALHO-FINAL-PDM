# Roteiro de Apresentação do Projeto - Pet Shop App

Este documento divide a apresentação técnica do projeto em **5 partes**, ideal para um grupo de 5 pessoas. Cada parte foca em um aspecto específico da engenharia de software utilizada no aplicativo.

---

## 👤 Apresentador 1: Visão Geral e Interface (UI/UX)
**Foco:** O que o usuário vê, tecnologias base (React Native/Expo) e Design System.

**O que falar:**
*   **Introdução:** "Nosso projeto é um aplicativo móvel completo para gestão de Pet Shop e Clínica Veterinária, desenvolvido com **React Native** e **Expo**."
*   **Interface Responsiva:** "Focamos muito na experiência do usuário. Utilizamos `SafeAreaView` e `useWindowDimensions` para garantir que o app funcione perfeitamente em qualquer tamanho de tela, respeitando entalhes (notches) e barras de status."
*   **Identidade Visual:** "Recentemente, atualizamos toda a identidade visual para um tema vibrante em Vermelho (#E53935), garantindo consistência em botões, ícones e navegação."
*   **Componentização:** "Criamos componentes reutilizáveis como `Banner`, `PetCard` e `Header` para manter o código limpo e a interface padronizada."

**Arquivos para mostrar:**
*   `src/view/screens/HomeScreen.tsx` (Layout principal)
*   `src/view/components/Banner.tsx` (Componente reutilizável)

---

## 👤 Apresentador 2: Arquitetura MVVM (O "Cérebro" do App)
**Foco:** Como o código é organizado e separação de responsabilidades.

**O que falar:**
*   **Padrão Arquitetural:** "Não escrevemos todo o código dentro das telas. Utilizamos o padrão **MVVM (Model-View-ViewModel)**."
*   **Separação de Responsabilidades:**
    *   **View:** Só cuida da aparência (UI).
    *   **ViewModel:** Guarda o estado e a lógica (ex: `useHomeViewModel`).
    *   **Model:** Define como são os dados (ex: Entidade `Pet`).
*   **Benefício:** "Isso torna o código testável e fácil de manter. Se precisarmos mudar a regra de negócio, não quebramos a tela."
*   **Exemplo:** "A `HomeScreen` apenas 'pede' dados ao `HomeViewModel`, ela não sabe de onde os dados vêm."

**Arquivos para mostrar:**
*   `src/viewmodel/HomeViewModel.ts`
*   `src/viewmodel/ServicesViewModel.ts`

---

## 👤 Apresentador 3: Funcionalidades de Negócio (Serviços e Agendamento)
**Foco:** A lógica de interação do usuário com os serviços.

**O que falar:**
*   **Fluxo Principal:** "Uma das partes mais complexas é o sistema de agendamento de serviços."
*   **Filtragem Dinâmica:** "Implementamos filtros inteligentes na tela de Serviços. O usuário pode filtrar por 'Banho', 'Saúde', etc., e a lista atualiza instantaneamente usando `useMemo` para performance."
*   **Carrinho e Contexto:** "Para gerenciar os pedidos, usamos a **Context API** do React (`CartContext`). Isso permite que o carrinho de compras seja acessado de qualquer lugar do aplicativo sem precisar passar propriedades manualmente entre todas as telas."
*   **Validação de Fluxo:** "Implementamos regras de negócio, como impedir que um usuário não logado tente agendar um serviço, redirecionando-o para o login."

**Arquivos para mostrar:**
*   `src/view/screens/ServicesScreen.tsx`
*   `src/usecase/Cart/CartContext.tsx`

---

## 👤 Apresentador 4: Segurança e Autenticação (Auth)
**Foco:** Gestão de usuários, Login e Proteção de Rotas.

**O que falar:**
*   **Gestão de Sessão:** "A segurança é fundamental. O app gerencia o estado de autenticação em tempo real."
*   **Fluxo de Login:** "Temos telas de Login e Cadastro (`SignUp`) integradas. O sistema valida e-mails e senhas antes mesmo de enviar ao servidor (classe `AuthValidator`)."
*   **Tratamento de Erros:** "Recentemente refinamos o tratamento de erros para informar ao usuário exatamente o que deu errado (ex: 'Senha incorreta' vs 'Erro interno')."
*   **Navegação Protegida:** "O `RootNavigator` decide quais telas o usuário pode ver. Se ele sair da conta, o app automaticamente protege as rotas privadas."

**Arquivos para mostrar:**
*   `src/view/screens/LoginScreen.tsx`
*   `src/usecase/validator/authValidator.ts`
*   `src/usecase/auth/authUseCases.ts`

---

## 👤 Apresentador 5: Infraestrutura e Backend (Clean Architecture)
**Foco:** Como o app fala com o banco de dados (Supabase) e Injeção de Dependência.

**O que falar:**
*   **Clean Architecture:** "O coração técnico do projeto. Usamos **Injeção de Dependência** (`container.ts`)."
*   **Flexibilidade:** "Podemos trocar o banco de dados inteiro sem mudar uma linha de código nas telas. Hoje usamos **Supabase**, mas poderíamos usar Firebase ou uma API REST apenas trocando a implementação no container."
*   **Repositórios:** "Temos uma camada de Repositórios (`SupabasePetRepository`, etc.) que isola o banco de dados. O restante do app não sabe que usamos Supabase, apenas chama métodos como `getAllPets()`."
*   **Banco de Dados:** "Utilizamos tabelas relacionais para vincular Usuários, Pets e Agendamentos de forma íntegra."

**Arquivos para mostrar:**
*   `src/di/container.ts` (Onde a mágica da injeção acontece)
*   `src/infra/repositories/supabaseTrackingRepository.ts`
