
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useShopViewModel } from '../../src/viewmodel/ShopViewModel';
import { productUseCases } from '../../src/di/container';
import { Alert } from 'react-native';
import Product from '../../src/model/entities/product';

// Mock dependencies
jest.mock('../../src/di/container', () => ({
  productUseCases: {
    getAllProducts: jest.fn(),
  },
}));

// Mock useCart hook
const mockAddItem = jest.fn();
jest.mock('../../src/usecase/Cart/CartContext', () => ({
  useCart: () => ({
    addItem: mockAddItem,
  }),
}));

// Mock useFocusEffect
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('useShopViewModel', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Ração Premium',
    price: 100.0,
    description: 'Ração de alta qualidade',
    category: 'Alimentação',
    imageUrl: 'http://example.com/image.png',
    stock: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load products on focus', async () => {
    (productUseCases.getAllProducts as jest.Mock).mockResolvedValue([mockProduct]);

    const { result } = renderHook(() => useShopViewModel());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([mockProduct]);
    expect(productUseCases.getAllProducts).toHaveBeenCalled();
  });

  it('should handle error when loading products', async () => {
    const error = new Error('Failed to fetch');
    (productUseCases.getAllProducts as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useShopViewModel());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possível carregar os produtos.');
  });

  it('should show confirmation alert when adding product to cart', () => {
    const { result } = renderHook(() => useShopViewModel());

    act(() => {
      result.current.addProductToCart(mockProduct);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Adicionar ao Carrinho',
      expect.stringContaining(mockProduct.name),
      expect.any(Array)
    );
  });

  it('should add item to cart when confirmed', () => {
    const { result } = renderHook(() => useShopViewModel());

    act(() => {
      result.current.addProductToCart(mockProduct);
    });

    // Simulate pressing "Adicionar" in the Alert
    const alertCalls = (Alert.alert as jest.Mock).mock.calls;
    const buttons = alertCalls[0][2]; // 3rd argument is buttons array
    const addButton = buttons.find((b: any) => b.text === 'Adicionar');
    
    act(() => {
      addButton.onPress();
    });

    expect(mockAddItem).toHaveBeenCalledWith({
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      type: 'product',
      image: mockProduct.imageUrl,
      quantity: 1,
    });
    
    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', expect.stringContaining('adicionado ao carrinho!'));
  });
});
