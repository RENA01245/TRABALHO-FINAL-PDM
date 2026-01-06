import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useCart } from '../../src/context/CartContext';
import Service from '../../src/model/entities/service';
import Pet from '../../src/model/entities/pet';
import { serviceUseCases, petUseCases } from '../../src/di/container';
import { useAuth } from '../../src/context/AuthContext';

export const useServicesViewModel = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  
  const [services, setServices] = useState<Service[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetModal, setShowPetModal] = useState(false);


  useEffect(() => {
    loadServices();
    if (user?.uID) {
      console.log("🔍 Carregando pets para o uID:", user.uID); // VEJA O QUE APARECE AQUI
      loadPets(user.uID);
    }
  }, [user]);

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
      const fetchedPets = await petUseCases.getAllPetsByClientId(clientId);
      setPets(fetchedPets);
      if (fetchedPets.length > 0) {
        setSelectedPet(fetchedPets[0]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os pets.');
    }
  };

  const addServiceToCart = (service: Service) => {
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
