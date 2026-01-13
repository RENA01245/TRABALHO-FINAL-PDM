import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = () => {
  const { user, isAdmin, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLoginAsAdmin = async () => {
    try {
      setLoading(true);
      const loggedUser = await login('admin@petcare.com', 'admin123');
      Alert.alert('Sucesso', `Login como administrador realizado!\nBem-vindo, ${loggedUser.userName}!`);
    } catch (error: any) {
      console.error('Erro no login:', error);
      Alert.alert(
        'Erro no Login',
        error.message || 'Não foi possível fazer login. Verifique as credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      Alert.alert('Sucesso', 'Logout realizado!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível fazer logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.userName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={styles.adminText}>Administrador</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loading}
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginSection}>
          <Text style={styles.sectionTitle}>Login de Teste</Text>
          <TouchableOpacity
            style={styles.adminLoginButton}
            onPress={handleLoginAsAdmin}
            disabled={loading}
          >
            <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.adminLoginButtonText}>
              Entrar como Administrador
            </Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>
            Email: admin@petcare.com{'\n'}Senha: admin123
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    marginTop: 20,
  },
  userInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  adminText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 6,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  adminLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  adminLoginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SettingsScreen;