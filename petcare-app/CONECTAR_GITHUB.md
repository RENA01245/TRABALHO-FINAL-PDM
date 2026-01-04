# 🔗 Conectar Projeto ao GitHub

## 📍 Repositório Remoto

**URL**: https://github.com/RENA01245/TRABALHO-FINAL-PDM.git

## 🚀 Comandos para Executar

### Passo 1: Navegar para o Projeto

```powershell
cd petcare-app
```

Ou caminho completo:
```powershell
cd "C:\Users\Renan Jucá\Downloads\TRABALHO-FINAL-PDM-TELA-HOME\TRABALHO-FINAL-PDM-TELA-HOME\petcare-app"
```

### Passo 2: Inicializar Git (se ainda não foi feito)

```powershell
git init
```

### Passo 3: Adicionar Todos os Arquivos

```powershell
git add .
```

### Passo 4: Fazer Commit Inicial

```powershell
git commit -m "feat: implementação completa do PetCare App

- Tela inicial com navegação completa
- Sistema de carrinho com Context API
- Telas: Shop, Services, Cart, OrderTracking
- Deep link do WhatsApp
- Dados mockados para demonstração
- Arquitetura limpa com TypeScript
- Navegação com React Navigation
- Documentação técnica completa"
```

### Passo 5: Conectar ao Repositório Remoto

```powershell
git remote add origin https://github.com/RENA01245/TRABALHO-FINAL-PDM.git
```

### Passo 6: Verificar Remote

```powershell
git remote -v
```

Deve mostrar:
```
origin  https://github.com/RENA01245/TRABALHO-FINAL-PDM.git (fetch)
origin  https://github.com/RENA01245/TRABALHO-FINAL-PDM.git (push)
```

### Passo 7: Renomear Branch para main

```powershell
git branch -M main
```

### Passo 8: Enviar Código para o GitHub

```powershell
git push -u origin main
```

---

## ⚠️ Se o Repositório Já Tiver Conteúdo

Se o repositório remoto já tiver commits, você pode precisar fazer pull primeiro:

```powershell
# Baixar conteúdo remoto
git pull origin main --allow-unrelated-histories

# Resolver conflitos se houver
# Depois fazer push
git push -u origin main
```

---

## ✅ Verificação

Após o push, acesse:
https://github.com/RENA01245/TRABALHO-FINAL-PDM

Você deve ver todos os arquivos do projeto!

---

## 📋 Checklist

- [ ] Git inicializado
- [ ] Arquivos adicionados (git add .)
- [ ] Commit feito
- [ ] Remote adicionado
- [ ] Branch renomeada para main
- [ ] Push realizado com sucesso

---

## 🔄 Comandos Úteis para o Futuro

### Atualizar Código no GitHub

```powershell
git add .
git commit -m "descrição das alterações"
git push
```

### Baixar Alterações do GitHub

```powershell
git pull
```

### Ver Status

```powershell
git status
```

### Ver Histórico

```powershell
git log --oneline
```

---

**Pronto para enviar!** 🚀

