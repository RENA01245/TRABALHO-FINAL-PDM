
import { renderHook, act } from '@testing-library/react-native';
import { useProductDetailsViewModel } from '../../src/viewmodel/ProductDetailsViewModel';
import { useCart } from '../../src/usecase/Cart/CartContext';
import { Alert } from 'react-native';

jest.mock('../../src/usecase/Cart/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('useProductDetailsViewModel', () => {
  const mockProduct = { id: 'prod1', name: 'Ração', price: 50, imageUrl: 'img.jpg' };
  const mockAddItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({ addItem: mockAddItem });
  });

  it('should initialize with quantity 1', () => {
    const { result } = renderHook(() => useProductDetailsViewModel(mockProduct));
    expect(result.current.quantity).toBe(1);
  });

  it('should increase and decrease quantity', () => {
    const { result } = renderHook(() => useProductDetailsViewModel(mockProduct));

    act(() => {
      result.current.increaseQuantity();
    });
    expect(result.current.quantity).toBe(2);

    act(() => {
      result.current.decreaseQuantity();
    });
    expect(result.current.quantity).toBe(1);

    act(() => {
      result.current.decreaseQuantity();
    });
    expect(result.current.quantity).toBe(1); // Should not go below 1
  });

  it('should add to cart with confirmation', () => {
    const { result } = renderHook(() => useProductDetailsViewModel(mockProduct));

    act(() => {
      result.current.addToCart();
    });

    const alertCalls = (Alert.alert as jest.Mock).mock.calls;
    const addButton = alertCalls[0][2][1];

    act(() => {
      addButton.onPress();
    });

    expect(mockAddItem).toHaveBeenCalledWith(expect.objectContaining({
      id: mockProduct.id,
      quantity: 1,
    }));
  });
});
