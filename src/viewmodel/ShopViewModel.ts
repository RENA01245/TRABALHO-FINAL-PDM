import { useEffect, useState } from 'react';
import { useCart } from '../usecase/Cart/CartContext';
import { useAlert } from '../view/context/AlertContext';
import Product from '../../src/model/entities/product';
import { productUseCases } from '../../src/di/container';

export const useShopViewModel = () => {
  const { addItem } = useCart();
  const { showAlert } = useAlert();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await productUseCases.getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error(error);
      showAlert('Erro', 'Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  };

  const addProductToCart = (product: Product) => {
    showAlert(
      'Adicionar ao Carrinho',
      `Deseja adicionar ${product.name} ao carrinho?`,
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
              quantity: 1,
            });

            showAlert('Sucesso', `${product.name} adicionado ao carrinho!`);
          },
        },
      ]
    );
  };

  return {
    products,
    loading,
    addProductToCart,
  };
};
