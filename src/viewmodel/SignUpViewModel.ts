import { useState } from 'react';
import { authUseCases } from '../di/container';

export const useSignUpViewModel = (navigation: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authUseCases.signUp(name, email, password);
      // Após cadastro com sucesso, o login é automático (geralmente), 
      // ou podemos pedir para logar. 
      // Se o signUp do useCase já retorna o usuário e loga, podemos ir para o Home/Perfil.
      // O Supabase geralmente loga automaticamente após signup se não houver confirmação de email obrigatória.
      // Se houver, o AuthStateChanged vai disparar.
      
      // Vamos assumir que o fluxo leva ao login automático ou pede login.
      // Por segurança, vamos navegar para o Login preenchendo os dados ou direto para o App se o AuthStateChanged pegar.
      // Como o AuthStateChanged é global, se logar, a tela de Settings vai atualizar sozinha.
      // Mas precisamos sair da tela de SignUp.
      
      // Vamos navegar para a tela principal (MainTabs)
      navigation.navigate('MainTabs');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
      setLoading(true);
      setError(null);
      try {
          await authUseCases.loginWithGoogle();
          // OAuth serve tanto para login quanto para signup
          // Navega para a tela principal
          navigation.navigate('MainTabs');
      } catch (err: any) {
           console.error(err);
           if (err.message && err.message.includes('cancelado')) {
               return;
           }
           setError(err.message || 'Erro no cadastro com Google.');
      } finally {
          setLoading(false);
      }
  };

  const goToLogin = () => {
    navigation.goBack();
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    handleSignUp,
    handleGoogleSignUp,
    goToLogin
  };
};
