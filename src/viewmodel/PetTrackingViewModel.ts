import { useState, useEffect } from 'react';
import { trackingUseCases, authUseCases } from '../di/container';
import {PetAttendance, PetStatus } from '../model/entities/petAttendance';
import User from '../model/entities/user';

export const useOrderTrackingViewModel = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [attendances, setAttendances] = useState<PetAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. O listener deve ser chamado diretamente
    const unsubscribe = authUseCases.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user?.uID) {
        setLoading(true); // Garante o estado de loading ao trocar de usuário
        try {
          const data = await trackingUseCases.getPetTracking(user.uID);
          setAttendances(data);
        } catch (error) {
          console.error("Erro ao carregar acompanhamento:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setAttendances([]);
        setLoading(false);
      }
    });

    // 2. Limpeza correta do listener
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // A ViewModel agora entrega um método que mapeia o objeto completo
  const getStatusDetails = (status: string) => {
    const statusMap: { [key: string]: { color: string; icon: string; desc: string } } = {
      'aguardando': { color: '#FFA500', icon: 'hourglass-outline', desc: 'Seu pet está relaxando na espera.' },
      'em_banho': { color: '#2196F3', icon: 'water-outline', desc: 'Hora da limpeza e relaxamento!' },
      'na_tosa': { color: '#9C27B0', icon: 'cut-outline', desc: 'Ficando bonitão no estilo.' },
      'em_cirurgia': { color: '#F44336', icon: 'medkit-outline', desc: 'Procedimento em andamento. Equipe focada.' }, 
      'recuperacao': { color: '#FFEB3B', icon: 'bed-outline', desc: 'Acordando da anestesia com carinho.' },
      'em_consulta': { color: '#2196F3', icon: 'stethoscope-outline', desc: 'Sendo examinado pelo veterinário.' },
      'pronto': { color: '#4CAF50', icon: 'checkmark-circle-outline', desc: 'Tudo pronto! Pode vir buscar.' }
    };

    return statusMap[status.toLowerCase()] || { color: '#999', icon: 'help-circle-outline', desc: 'Status em atualização...' };
  };

  return {
    attendances,
    loading,
    getStatusDetails
  };
};