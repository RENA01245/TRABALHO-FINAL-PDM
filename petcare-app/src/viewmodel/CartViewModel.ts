import { Alert, Linking } from 'react-native';
import { useCart } from '@/context/CartContext';
import { mockUser } from '../../__test__/data/mockData';

export const useCartViewModel = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const sendOrderToWhatsApp = async () => {
    if (items.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens ao carrinho primeiro!');
      return;
    }

    let message = `*Pedido - PetCare*\n\n`;
    message += `*Cliente:* ${mockUser[0].userName}\n`;
    message += `*Telefone:* ${mockUser[0].telefone}\n\n`;
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

    const url = `whatsapp://send?phone=${mockUser[0].telefone}&text=${encodeURIComponent(message)}`;

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
