import { useState } from 'react';
import { authUseCases } from '../di/container';
import { Alert } from 'react-native';

export const useLoginViewModel = (navigation: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authUseCases.login(email, password);
      // Após login com sucesso, navega para a tela principal
      navigation.navigate('MainTabs');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleLogin = async () => {
      setLoading(true);
      setError(null);
      try {
          await authUseCases.loginWithGoogle();
          // Assume que o login foi bem sucedido se não houve erro
          navigation.navigate('MainTabs');
      } catch (err: any) {
           console.error(err);
           if (err.message && err.message.includes('cancelado')) {
               // Ignora erro de cancelamento do usuário
               return;
           }
           setError(err.message || 'Erro no login com Google.');
      } finally {
          setLoading(false);
      }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    handleSignUp,
    handleGoogleLogin
  };
};
