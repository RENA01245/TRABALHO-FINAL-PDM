# 🚀 Iniciar Repositório Git - Guia Rápido

## ⚡ Comandos para PowerShell (Windows)

### 1. Navegar para o Projeto

```powershell
cd "C:\Users\Renan Jucá\Downloads\TRABALHO-FINAL-PDM-TELA-HOME\TRABALHO-FINAL-PDM-TELA-HOME\petcare-app"
```

### 2. Inicializar Git

```powershell
git init
```

### 3. Verificar Status

```powershell
git status
```

### 4. Adicionar Todos os Arquivos

```powershell
git add .
```

### 5. Fazer Commit Inicial

```powershell
git commit -m "feat: implementação inicial do PetCare App - Tela inicial com navegação completa - Sistema de carrinho com Context API - Telas: Shop, Services, Cart, OrderTracking - Deep link do WhatsApp - Dados mockados para demonstração - Arquitetura limpa com TypeScript"
```

### 6. Verificar Commit

```powershell
git log --oneline
```

---

## 🔗 Conectar ao GitHub

### Passo 1: Criar Repositório no GitHub

1. Acesse https://github.com
2. Clique em "New repository"
3. Nome: `petcare-app`
4. **NÃO** marque "Initialize with README"
5. Clique em "Create repository"

### Passo 2: Conectar e Enviar Código

```powershell
# Adicionar remote (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/petcare-app.git

# Verificar remote
git remote -v

# Renomear branch para main
git branch -M main

# Enviar código
git push -u origin main
```

---

## ✅ Arquivos Criados

- ✅ `.gitignore` - Configurado para React Native/Expo
- ✅ `COMANDOS_GIT.md` - Guia completo de Git
- ✅ `INICIAR_GIT.md` - Este guia rápido

---

## 📋 O que será commitado

✅ Código fonte (src/)  
✅ Configurações (package.json, tsconfig.json, app.json)  
✅ Documentação (README.md)  
✅ Componentes e telas  
✅ Context API  
✅ Dados mockados  

❌ **NÃO será commitado** (já no .gitignore):
- node_modules/
- .expo/
- Arquivos de build
- Logs

---

## 🎯 Próximos Passos

1. Execute os comandos acima
2. Crie o repositório no GitHub
3. Conecte e faça push
4. Compartilhe o link do repositório!

---

**Pronto para versionar!** 🎉

