import { useState } from 'react';
import { Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import Product from '../../src/model/entities/product';

export const useProductDetailsViewModel = (product: Product) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      type: 'product',
      image: product.imageUrl ?? '',
      quantity,
    });

    Alert.alert(
      'Sucesso',
      `${quantity}x ${product.name} adicionado ao carrinho!`
    );
  };

  return {
    quantity,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
  };
};
