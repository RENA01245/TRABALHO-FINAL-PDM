import { Alert, Linking } from 'react-native';
import { useCart } from '@/context/CartContext';
import { authUseCases } from '@/di/container';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import User from '@/model/entities/user';

/**
 * ViewModel para a tela de Carrinho
 * Usa o sistema de DI para obter dados do usuário atual
 * Funciona tanto com mocks quanto com banco real
 */
export const useCartViewModel = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  console.log(authUseCases)

  // Carrega o usuário atual usando o sistema de DI
  // Isso funciona tanto com mocks quanto com banco real
  useEffect(() => {
    // Observa mudanças no estado de autenticação
    const unsubscribe = authUseCases.onAuthStateChanged((user) => {
      console.log(user)
      setCurrentUser(user);
    });

    // Retorna função de limpeza
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const sendOrderToWhatsApp = async () => {
    if (items.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens ao carrinho primeiro!');
      return;
    }

    // Verifica se há usuário logado
    if (!currentUser) {
      Alert.alert('Erro', 'Você precisa estar logado para enviar o pedido.');
      return;
    }

    // Usa dados do usuário atual (obtido via DI, funciona com mocks e banco real)
    
    const userName = currentUser.userName || 'Cliente';
    const telefone = currentUser.telefone || '';

    if (!telefone) {
      Alert.alert('Erro', 'Telefone não cadastrado. Por favor, complete seu cadastro.');
      return;
    }

    let message = `*Pedido - PetCare*\n\n`;
    message += `*Cliente:* ${userName}\n`;
    message += `*Telefone:* ${telefone}\n\n`;
    message += `*Itens do Pedido:*\n\n`;

    const products = items.filter(item => item.type === 'product');
    const services = items.filter(item => item.type === 'service');

    if (products.length > 0) {
      message += `*Produtos:*\n`;
      products.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
      });
      message += `\n`;
    }

    if (services.length > 0) {
      message += `*Serviços:*\n`;
      services.forEach(item => {
        message += `• ${item.name}${item.petName ? ` (${item.petName})` : ''} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
      });
      message += `\n`;
    }

    message += `*Total: ${formatPrice(getTotal())}*\n\n`;
    message += `Obrigado pela preferência! 🐾`;

    const url = `whatsapp://send?phone=${telefone}&text=${encodeURIComponent(message)}`;

    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert(
        'WhatsApp não instalado',
        'Por favor, instale o WhatsApp para enviar o pedido.'
      );
      return;
    }

    await Linking.openURL(url);
    clearCart();
  };

  return {
    items,
    formatPrice,
    updateQuantity,
    removeItem,
    getTotal,
    sendOrderToWhatsApp,
  };
};
