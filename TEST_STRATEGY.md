
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

**Pré-requisitos**:
*   Node.js instalado.
*   Dependências instaladas (`npm install`).

**Executando Testes Unitários e de Integração**:
```bash
npm test
# Ou para rodar com cobertura
npm test -- --coverage
```

**Executando Testes E2E (Playwright)**:
*Nota: Como o projeto é Expo, os testes E2E com Playwright são configurados para rodar contra a versão Web do app.*

1.  Instale os navegadores do Playwright (apenas na primeira vez):
    ```bash
    npx playwright install
    ```

2.  Execute os testes:
    ```bash
    npx playwright test
    ```
    *Isso iniciará o servidor web do Expo automaticamente e rodará os testes.*

3.  Para ver o relatório visual:
    ```bash
    npx playwright show-report
    ```
