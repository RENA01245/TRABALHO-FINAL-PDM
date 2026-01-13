import { useState, useEffect } from 'react';
import { trackingUseCases, authUseCases } from '../di/container';
import { PetAttendance } from '../model/entities/petAttendance';
import User from '../model/entities/user';
import { Dimensions } from 'react-native';

export const useHomeViewModel = (navigation: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [attendances, setAttendances] = useState<PetAttendance[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { width } = Dimensions.get('window');
  const ITEM_SIZE = width - 40;

  // Busca os atendimentos ativos
  useEffect(() => {
    let unsubscribe: () => void;

    // O onAuthStateChanged já monitora o estado inicial e qualquer mudança futura
    unsubscribe = authUseCases.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user?.uID) {
        setLoading(true); 
        try {
          // Busca os atendimentos assim que o ID do usuário é detectado
          const data = await trackingUseCases.getPetTracking(user.uID);
          setAttendances(data);
          
          // Resetamos o índice do rodízio para o primeiro pet ao carregar novos dados
          setCurrentIndex(0); 
        } catch (error) {
          console.error("Erro ao carregar acompanhamento:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Se não há usuário, limpamos a lista
        setAttendances([]);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Lógica de Rodízio (Troca a cada 1 minuto)
  useEffect(() => {
    if (attendances.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % attendances.length);
    }, 10000); // 20.000ms = 20 segundos

    return () => clearInterval(interval);
  }, [attendances]);

  const services = [
    { id: '1', icon: 'cut', title: 'Banho e tosa' },
    { id: '2', icon: 'medical', title: 'Consultas e exames' },
    { id: '3', icon: 'storefront', title: 'Nossa loja' },
  ];

  // HomeViewModel.ts
  const handleServicePress = (serviceId: string) => {
    if (serviceId === '1') {
      // Para Navegação Aninhada: Nome da Tab -> Nome da Tela dentro do Stack -> Parâmetros
      navigation.navigate('Services', {
        screen: 'Services', // O nome definido no Stack.Screen do ServicesStack
        params: { filter: 'bath' },
      });
    } else if (serviceId === '2') {
      navigation.navigate('Services', {
        screen: 'Services',
        params: { filter: 'health' },
      });
    } else {
      navigation.navigate('Shop');
    }
  };

  const goToOrderTracking = () => {
    navigation.navigate('OrderTracking');
  };

  // Retorna o pet que deve ser exibido no momento
  const currentVisiblePet = attendances.length > 0 ? attendances[currentIndex] : null;

  return {
    searchText,
    setSearchText,
    services,
    handleServicePress,
    goToOrderTracking,
    currentVisiblePet, // Novo dado para a View
    hasAttendance: attendances.length > 0,
  };
};