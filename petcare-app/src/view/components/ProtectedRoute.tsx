import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallbackComponent?: React.ReactNode;
}

/**
 * Componente de proteção de rota
 * 
 * Frontend (UX + primeira barreira):
 * - Redireciona usuários não autorizados rapidamente
 * - Melhora a experiência do usuário
 * - Deixa claro que essa verificação é apenas uma camada extra
 * 
 * IMPORTANTE: Esta é apenas uma camada de UX. A segurança real
 * deve ser implementada no backend validando todas as requisições.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  fallbackComponent,
}) => {
  const { user, loading, isAdmin } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    // Redireciona se não estiver autenticado
    if (!loading && !user) {
      // Navega para a tela inicial (ou tela de login quando implementada)
      // Por enquanto, apenas não renderiza o conteúdo
      return;
    }

    // Redireciona se precisar de admin mas não for admin
    if (!loading && requireAdmin && !isAdmin) {
      // Navega para a tela inicial
      // Por enquanto, apenas não renderiza o conteúdo
      return;
    }
  }, [user, loading, isAdmin, requireAdmin, navigation]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  // Verifica se está autenticado
  if (!user) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Acesso não autorizado</Text>
        <Text style={styles.errorSubtext}>
          Você precisa estar logado para acessar esta área.
        </Text>
      </View>
    );
  }

  // Verifica se precisa de admin
  if (requireAdmin && !isAdmin) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Acesso restrito</Text>
        <Text style={styles.errorSubtext}>
          Esta área é restrita apenas para administradores.
        </Text>
        <Text style={styles.warningText}>
          ⚠️ Esta verificação é apenas uma camada de UX. A segurança real
          é garantida pelo backend.
        </Text>
      </View>
    );
  }

  // Usuário autorizado - renderiza o conteúdo
  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
    color: '#FF9500',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
});

export default ProtectedRoute;

