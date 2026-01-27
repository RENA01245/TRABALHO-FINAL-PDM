// viewmodel/ServicesViewModel.ts
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useCart } from '../usecase/Cart/CartContext';
import { Service } from '../../src/model/entities/service';
import Pet from '../../src/model/entities/pet';
import User from '../../src/model/entities/user';
import { serviceUseCases, petUseCases, authUseCases } from '../../src/di/container';

export const useServicesViewModel = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();

  // Estados de dados
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  
  // Estados de UI
  const [showPetModal, setShowPetModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(route.params?.filter);

  const { addItem } = useCart();

  // Monitora mudanças de parâmetros de navegação (Deep Linking/Nested Nav)
  useEffect(() => {
    if (route.params?.filter !== activeFilter) {
      setActiveFilter(route.params?.filter);
    }
  }, [route.params?.filter]);

  // Ciclo de vida: Carregamento inicial e Auth
  useEffect(() => {
    const unsubscribe = authUseCases.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setPets([]);
        setSelectedPet(null);
      }
    });

    return () => unsubscribe?.();
  }, []);

  // Busca de dados no Repositório
  const loadServices = useCallback(async () => {
    try {
      const fetchedServices = await serviceUseCases.getAllServices();
      setServices(fetchedServices);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os serviços.');
    }
  }, []);

  const loadPets = useCallback(async (clientId: string) => {
    try {
      const fetchedPets = await petUseCases.getAllPetsByClientId(clientId);
      setPets(fetchedPets);
      if (fetchedPets.length > 0) setSelectedPet(fetchedPets[0]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pets.');
    }
  }, []);

  // Recarrega dados sempre que a tela ganha foco ou o usuário muda
  useFocusEffect(
    useCallback(() => {
      loadServices();
      if (currentUser?.uID) {
        loadPets(currentUser.uID);
      }
    }, [currentUser, loadServices, loadPets])
  );

  // Lógica de Filtragem (Memorizada para performance)
  const filteredServices = useMemo(() => {
    if (!activeFilter) return services;

    return services.filter((s) => {
      const name = s.name.toLowerCase();
      if (activeFilter === 'bath') {
        return name.includes('banho') || name.includes('tosa') || name.includes('hidratação');
      }
      if (activeFilter === 'health') {
        return ['consulta', 'exame', 'raio', 'cirurgia', 'ultrassonografia'].some((term) => 
          name.includes(term)
        );
      }
      return true;
    });
  }, [services, activeFilter]);

  // Categorias para exibição na View
  const displayExams = useMemo(() => 
    filteredServices.filter((s) =>
      ['consulta', 'exame', 'raio', 'cirurgia', 'Ultrassonografia'].some((t) => s.name.toLowerCase().includes(t))
    ), [filteredServices]);

  const displayBath = useMemo(() => 
    filteredServices.filter((s) =>
      ['banho', 'tosa', 'hidratação'].some((t) => s.name.toLowerCase().includes(t))
    ), [filteredServices]);

  // Ações da View
  const addServiceToCart = (service: Service) => {
    // Verifica se há usuário logado
    if (!currentUser) {
      Alert.alert('Erro', 'Você precisa estar logado para enviar o pedido.');
      return;
    }
    
    if (!selectedPet) {
      Alert.alert('Atenção', 'Selecione um pet antes de agendar.');
      return;
    }

    Alert.alert(
      'Confirmar Agendamento',
      `Deseja agendar ${service.name} para ${selectedPet.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            addItem({
              id: service.id,
              name: service.name,
              price: service.price ?? 0,
              type: 'service',
              petName: selectedPet.name,
              petId: selectedPet.id, // Adicionado petId para diferenciar
              quantity: 1,
            });

            Alert.alert('Sucesso', `${service.name} adicionado para ${selectedPet.name}!`);
          },
        },
      ]
    );
  };

  const selectPet = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetModal(false);
  };

  const clearFilter = () => {
    navigation.setParams(undefined);
    setActiveFilter(undefined);
  };
  
  const getFilterName = () => {
    if (activeFilter === 'bath') return 'Banho e Tosa';
    if (activeFilter === 'health') return 'Saúde';
    return '';
  };

  const categories = [
    { id: undefined, label: 'Todos', icon: 'grid-outline' },
    { id: 'bath', label: 'Banho e Tosa', icon: 'cut-outline' },
    { id: 'health', label: 'Saúde', icon: 'medkit-outline' },
  ];

  return {
    pets,
    selectedPet,
    showPetModal,
    displayExams,
    displayBath,
    isFiltered: !!activeFilter,
    setShowPetModal,
    selectPet,
    addServiceToCart,
    clearFilter,
    activeFilterName: getFilterName(),
    activeFilter,    // Para saber qual chip destacar
    setActiveFilter, // Para trocar o filtro ao clicar no chip
    categories,
  };
};