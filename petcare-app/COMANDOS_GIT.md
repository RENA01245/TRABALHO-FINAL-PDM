# 📦 Comandos Git - Preparar Projeto para Repositório

## 🚀 Passo a Passo Completo

### 1. Navegar para o Diretório do Projeto

```bash
cd petcare-app
```

### 2. Inicializar Repositório Git

```bash
git init
```

### 3. Adicionar Todos os Arquivos

```bash
git add .
```

### 4. Fazer o Commit Inicial

```bash
git commit -m "feat: implementação inicial do PetCare App

- Tela inicial com navegação completa
- Sistema de carrinho com Context API
- Telas: Shop, Services, Cart, OrderTracking
- Deep link do WhatsApp
- Dados mockados para demonstração
- Arquitetura limpa com TypeScript
- Navegação com React Navigation
- Documentação técnica completa"
```

### 5. Verificar Status

```bash
git status
```

### 6. Ver Histórico de Commits

```bash
git log --oneline
```

---

## 🔗 Conectar a um Repositório Remoto (GitHub/GitLab)

### Opção 1: Criar Repositório no GitHub Primeiro

1. Acesse [GitHub](https://github.com)
2. Crie um novo repositório (ex: `petcare-app`)
3. **NÃO** inicialize com README, .gitignore ou licença
4. Copie a URL do repositório

### Opção 2: Conectar Repositório Local ao Remoto

```bash
# Adicionar remote (substitua pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/petcare-app.git

# Verificar remote adicionado
git remote -v

# Enviar código para o repositório remoto
git branch -M main
git push -u origin main
```

---

## 📋 Estrutura de Commits Recomendada

### Padrão de Mensagens

Use o padrão **Conventional Commits**:

```
tipo(escopo): descrição curta

descrição detalhada (opcional)
```

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição de testes
- `chore`: Tarefas de manutenção

### Exemplos

```bash
# Nova funcionalidade
git commit -m "feat(cart): adicionar funcionalidade de carrinho"

# Correção
git commit -m "fix(navigation): corrigir navegação entre telas"

# Documentação
git commit -m "docs: atualizar README com instruções de instalação"

# Refatoração
git commit -m "refactor(components): melhorar estrutura dos componentes"
```

---

## 🔄 Comandos Git Úteis

### Ver Alterações

```bash
# Ver status
git status

# Ver diferenças
git diff

# Ver histórico
git log --oneline --graph
```

### Desfazer Alterações

```bash
# Desfazer alterações não commitadas
git checkout -- arquivo.tsx

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer último commit (remove alterações)
git reset --hard HEAD~1
```

### Branches

```bash
# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Listar branches
git branch

# Trocar de branch
git checkout main

# Mesclar branch
git merge feature/nova-funcionalidade
```

### Atualizar do Remoto

```bash
# Baixar alterações
git fetch origin

# Atualizar branch local
git pull origin main
```

---

## ⚠️ Arquivos que NÃO Serão Commitados

O arquivo `.gitignore` já está configurado para ignorar:

- ✅ `node_modules/` - Dependências (instaladas via npm)
- ✅ `.expo/` - Arquivos temporários do Expo
- ✅ `dist/` - Builds compilados
- ✅ `*.log` - Arquivos de log
- ✅ `.DS_Store` - Arquivos do macOS
- ✅ `coverage/` - Relatórios de testes
- ✅ Arquivos de ambiente (`.env`)

---

## ✅ Checklist Antes do Primeiro Commit

- [ ] `.gitignore` criado e configurado
- [ ] Todos os arquivos importantes estão no projeto
- [ ] `README.md` atualizado
- [ ] Código testado e funcionando
- [ ] Sem informações sensíveis no código
- [ ] Sem arquivos temporários ou de build

---

## 🎯 Próximos Passos Após o Commit

1. **Criar repositório no GitHub/GitLab**
2. **Conectar ao repositório remoto**
3. **Fazer push do código**
4. **Configurar branch de produção** (opcional)
5. **Adicionar colaboradores** (se necessário)

---

## 📝 Exemplo Completo de Primeira Vez

```bash
# 1. Navegar para o projeto
cd petcare-app

# 2. Inicializar Git
git init

# 3. Adicionar arquivos
git add .

# 4. Commit inicial
git commit -m "feat: implementação inicial do PetCare App"

# 5. Criar repositório no GitHub e copiar URL

# 6. Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/petcare-app.git

# 7. Renomear branch para main
git branch -M main

# 8. Enviar código
git push -u origin main
```

---

## 🔐 Boas Práticas

1. **Nunca commite**:
   - Senhas ou chaves de API
   - Arquivos `.env` com dados sensíveis
   - `node_modules/`
   - Arquivos de build

2. **Sempre commite**:
   - Código fonte
   - Arquivos de configuração
   - Documentação
   - `.gitignore`

3. **Commits frequentes**:
   - Faça commits pequenos e frequentes
   - Mensagens descritivas
   - Um commit por funcionalidade

---

**Pronto!** Seu projeto está configurado para Git! 🎉

