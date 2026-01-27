
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCartViewModel } from '../../src/viewmodel/CartViewModel';
import { useCart } from '../../src/usecase/Cart/CartContext';
import { authUseCases } from '../../src/di/container';
import { Alert, Linking } from 'react-native';

// Mocks
jest.mock('../../src/usecase/Cart/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../src/di/container', () => ({
  authUseCases: {
    onAuthStateChanged: jest.fn(),
  },
}));

jest.spyOn(Alert, 'alert');
jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);

describe('useCartViewModel', () => {
  const mockCartItems = [
    { id: '1', name: 'Product 1', price: 10, quantity: 2, type: 'product' },
    { id: '2', name: 'Service 1', price: 50, quantity: 1, type: 'service' },
  ];

  const mockCartContext = {
    items: mockCartItems,
    updateQuantity: jest.fn(),
    removeItem: jest.fn(),
    getTotal: jest.fn(() => 70),
    clearCart: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue(mockCartContext);
    (authUseCases.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      cb({ userName: 'Test User', telefone: '123456789' });
      return jest.fn();
    });
  });

  it('should initialize with cart items and user', () => {
    const { result } = renderHook(() => useCartViewModel());

    expect(result.current.items).toEqual(mockCartItems);
    expect(result.current.formatPrice(10)).toBe('R$ 10.00');
  });

  it('should send order to WhatsApp if logged in and cart not empty', async () => {
    const { result } = renderHook(() => useCartViewModel());

    await act(async () => {
      await result.current.sendOrderToWhatsApp();
    });

    expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('whatsapp://send'));
    expect(mockCartContext.clearCart).toHaveBeenCalled();
  });

  it('should show alert if cart is empty', async () => {
    (useCart as jest.Mock).mockReturnValue({ ...mockCartContext, items: [] });
    const { result } = renderHook(() => useCartViewModel());

    await act(async () => {
      await result.current.sendOrderToWhatsApp();
    });

    expect(Alert.alert).toHaveBeenCalledWith('Carrinho vazio', expect.any(String));
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('should show alert if user not logged in', async () => {
    (authUseCases.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      cb(null);
      return jest.fn();
    });

    const { result } = renderHook(() => useCartViewModel());

    await act(async () => {
      await result.current.sendOrderToWhatsApp();
    });

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Você precisa estar logado para enviar o pedido.');
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});
