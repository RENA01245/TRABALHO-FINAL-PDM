import { useDebugValue, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import Service from '../model/entities/service';
import Pet from '../model/entities/pet';
import User from '../model/entities/user';
import { serviceUseCases, petUseCases, authUseCases } from '../di/container';



export const useServicesViewModel = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { addItem } = useCart();
  
  const [services, setServices] = useState<Service[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetModal, setShowPetModal] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    const unsubscribe = authUseCases.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user?.uID) {
        console.log("🔍 Carregando pets para o uID:", user.uID);
        loadPets(user.uID);
      } else {
        setPets([]);
      }
    });

    // Retorna função de limpeza
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
    


  const loadServices = async () => {
    try {
      const fetchedServices = await serviceUseCases.getAllServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os serviços.');
    }
  };

  const loadPets = async (clientId: string) => {
    try {
      console.log('🔍 [ServicesViewModel] Carregando pets para clientId:', clientId);
      const fetchedPets = await petUseCases.getAllPetsByClientId(clientId);
      console.log('✅ [ServicesViewModel] Pets carregados:', fetchedPets.length, fetchedPets);
      setPets(fetchedPets);
      if (fetchedPets.length > 0) {
        setSelectedPet(fetchedPets[0]);
        console.log('✅ [ServicesViewModel] Pet selecionado:', fetchedPets[0].name);
      } else {
        console.warn('⚠️ [ServicesViewModel] Nenhum pet encontrado para clientId:', clientId);
      }
    } catch (error) {
      console.error('❌ [ServicesViewModel] Erro ao carregar pets:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pets.');
    }
  };

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

    addItem({
      id: service.id,
      name: service.name,
      price: service.price ?? 0,
      type: 'service',
      petName: selectedPet.name,
      quantity: 1,
    });

    Alert.alert(
      'Sucesso',
      `${service.name} adicionado para ${selectedPet.name}!`
    );
  };

  const selectPet = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetModal(false);
  };

  const examAndConsultationServices = services.filter((s) =>
    ['Consulta', 'Exame', 'Raio', 'Cirurgia', 'Ultrasonografia'].some((term) =>
      s.name.includes(term)
    )
  );

  const bathAndGroomingServices = services.filter((s) =>
    ['Banho', 'Tosa'].some((term) => s.name.includes(term))
  );

  return {
    services,
    pets,
    selectedPet,
    showPetModal,

    examAndConsultationServices,
    bathAndGroomingServices,

    setShowPetModal,
    selectPet,
    addServiceToCart,
  };
};
