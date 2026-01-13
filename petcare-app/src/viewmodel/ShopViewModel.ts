import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import Product from '../model/entities/product';
import { productUseCases } from '../di/container';

export const useShopViewModel = () => {
  const { addItem } = useCart();
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
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  };

  const addProductToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      type: 'product',
      image: product.imageUrl ?? '',
      quantity: 1,
    });

    Alert.alert('Sucesso', `${product.name} adicionado ao carrinho!`);
  };

  return {
    products,
    loading,
    addProductToCart,
  };
};
