
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve navegar para a tela de login', async ({ page }) => {
    // Assumindo que o app começa na Home ou pede Login. 
    // Se começar na Home deslogado, deve ter botão de Entrar ou redirecionar.
    // Vamos assumir que redireciona para Login ou tem um botão.
    
    // Verifica se estamos na tela de Login ou se tem campos de login
    // Ajuste os seletores conforme sua UI real (testID ou text)
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Senha')).toBeVisible();
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('errado@teste.com');
    await page.getByPlaceholder('Senha').fill('senhaerrada');
    await page.getByText('Entrar').click();

    await expect(page.getByText('Erro ao fazer login')).toBeVisible();
  });

  test('deve fazer login com sucesso', async ({ page }) => {
    // Usar credenciais de teste válidas (mockadas ou reais se ambiente de teste permitir)
    await page.getByPlaceholder('Email').fill('teste@teste.com');
    await page.getByPlaceholder('Senha').fill('123456');
    await page.getByText('Entrar').click();

    // Deve navegar para a Home
    await expect(page.getByText('Olá,')).toBeVisible(); // Verifica saudação na Home
  });

  test('deve navegar para cadastro', async ({ page }) => {
    await page.getByText('Cadastre-se').click();
    await expect(page.getByPlaceholder('Nome')).toBeVisible();
    await expect(page.getByPlaceholder('Confirme a senha')).toBeVisible();
  });
});
