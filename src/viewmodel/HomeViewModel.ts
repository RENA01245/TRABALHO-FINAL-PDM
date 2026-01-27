import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { trackingUseCases, authUseCases, productUseCases, serviceUseCases } from '../di/container';
import { PetAttendance } from '../model/entities/petAttendance';
import User from '../model/entities/user';
import Product from '../model/entities/product';
import { Service } from '../model/entities/service';

export const useHomeViewModel = (navigation: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [attendances, setAttendances] = useState<PetAttendance[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Search States
  const [searchResults, setSearchResults] = useState<{ products: Product[], services: Service[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Monitora autenticação
  useEffect(() => {
    const unsubscribe = authUseCases.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Função centralizada de busca
  const fetchAttendances = useCallback(async () => {
    if (!currentUser?.uID) {
      setAttendances([]);
      return;
    }

    try {
      const data = await trackingUseCases.getPetTracking(currentUser.uID);
      setAttendances(data);
    } catch (error) {
      console.error("Erro ao carregar acompanhamento:", error);
    }
  }, [currentUser]);

  // Busca ao focar na tela
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAttendances().finally(() => setLoading(false));
    }, [fetchAttendances])
  );

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAttendances();
    setRefreshing(false);
  }, [fetchAttendances]);

  // Search Effect
  useEffect(() => {
    const performSearch = async () => {
      if (searchText.length < 2) {
        setSearchResults(null);
        return;
      }

      setIsSearching(true);
      try {
        const [allProducts, allServices] = await Promise.all([
          productUseCases.getAllProducts(),
          serviceUseCases.getAllServices()
        ]);

        const filteredProducts = allProducts.filter(p => 
          p.name.toLowerCase().includes(searchText.toLowerCase())
        );
        const filteredServices = allServices.filter(s => 
          s.name.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchResults({ products: filteredProducts, services: filteredServices });
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(performSearch, 500);
    return () => clearTimeout(debounce);
  }, [searchText]);

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
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('OrderTracking');
  };

  const goToProductDetails = (product: Product) => {
     // Assuming ShopStack -> ProductDetails
     navigation.navigate('Shop', {
       screen: 'ProductDetails',
       params: { product }
     });
  };

  return {
    searchText,
    setSearchText,
    services,
    handleServicePress,
    goToOrderTracking,
    attendances, // Expondo a lista completa para o carrossel
    hasAttendance: attendances.length > 0,
    loading,
    currentUser,
    searchResults,
    isSearching,
    goToProductDetails,
    refreshing,
    onRefresh
  };
};
