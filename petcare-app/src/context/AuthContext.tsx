import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import User from '../model/entities/user';
import { authUseCases } from '../di/container';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observa mudanças no estado de autenticação
    const unsubscribe = authUseCases.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const loggedUser = await authUseCases.login(email, password);
      console.log('✅ [AuthContext] Login realizado:', loggedUser.userName, 'Pets:', loggedUser.pets?.length || 0);
      // Atualiza o estado do usuário imediatamente após login
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authUseCases.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (user?.uID) {
      try {
        // Recarrega o usuário do repositório
        const unsubscribe = authUseCases.onAuthStateChanged((currentUser) => {
          setUser(currentUser);
        });
        // Limpa a subscription após obter o usuário
        setTimeout(() => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        }, 100);
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

