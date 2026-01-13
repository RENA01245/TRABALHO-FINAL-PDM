import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { adminUseCases } from '../di/container';
import { useAuth } from '../context/AuthContext';

/**
 * ViewModel para a tela de Dashboard Administrativo
 * 
 * BACKEND (Segurança Real):
 * - Valida permissão de admin em todas as operações
 * - Bloqueia acesso mesmo em tentativas diretas
 */
export const useAdminDashboardViewModel = () => {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAdminAccess = async () => {
      if (!user?.uID) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        // BACKEND: Validação real de permissão de admin
        await adminUseCases.validateAdminAccess(user.uID);
        setIsAuthorized(true);
      } catch (error: any) {
        console.error('Erro ao validar acesso de admin:', error);
        setIsAuthorized(false);
        Alert.alert(
          'Acesso Negado',
          error.message || 'Você não tem permissão para acessar esta área.',
        );
      } finally {
        setLoading(false);
      }
    };

    validateAdminAccess();
  }, [user]);

  return {
    isAuthorized,
    loading,
    user,
  };
};

