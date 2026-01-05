import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export interface HomeService {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

export const useHomeViewModel = (navigation: any) => {
  const [searchText, setSearchText] = useState('');

  const services: HomeService[] = [
    { id: '1', icon: 'cut', title: 'Banho e tosa' },
    { id: '2', icon: 'medical', title: 'Consultas e exames' },
    { id: '3', icon: 'storefront', title: 'Nossa loja' },
  ];

  const handleServicePress = (serviceId: string) => {
    switch (serviceId) {
      case '1':
      case '2':
        navigation.navigate('Services');
        break;
      case '3':
        navigation.navigate('Shop');
        break;
    }
  };

  const goToOrderTracking = () => {
    navigation.navigate('OrderTracking');
  };

  return {
    searchText,
    setSearchText,
    services,
    handleServicePress,
    goToOrderTracking,
  };
};
