import { useState } from 'react';
import { useCart } from '../usecase/Cart/CartContext';
import { useAlert } from '../view/context/AlertContext';
import Product from '../../src/model/entities/product';

export const useProductDetailsViewModel = (product: Product) => {
  const { showAlert } = useAlert();
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
    showAlert(
      'Adicionar ao Carrinho',
      `Deseja adicionar ${quantity}x ${product.name} ao carrinho?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Adicionar',
          onPress: () => {
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              type: 'product',
              image: product.imageUrl ?? '',
              quantity,
            });

            showAlert(
              'Sucesso',
              `${quantity}x ${product.name} adicionado ao carrinho!`
            );
          },
        },
      ]
    );
  };

  return {
    quantity,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
  };
};
