
import { CartCalculator } from '../../src/usecase/Cart/cartCalculator';
import { CartItem } from '../../src/usecase/Cart/CartContext';

describe('CartCalculator', () => {
  const mockItems: CartItem[] = [
    {
      id: '1',
      name: 'Item 1',
      price: 100,
      quantity: 2,
      type: 'product'
    },
    {
      id: '2',
      name: 'Item 2',
      price: 50,
      quantity: 1,
      type: 'service'
    }
  ];

  it('should calculate total correctly without discount', () => {
    const total = CartCalculator.calculateTotal(mockItems);
    // (100 * 2) + (50 * 1) = 250
    expect(total).toBe(250);
  });

  it('should calculate total correctly with discount', () => {
    const total = CartCalculator.calculateTotal(mockItems, 10); // 10% discount
    // 250 - 10% = 225
    expect(total).toBe(225);
  });

  it('should return 0 for empty cart', () => {
    const total = CartCalculator.calculateTotal([]);
    expect(total).toBe(0);
  });

  it('should handle invalid discount (negative)', () => {
     const total = CartCalculator.calculateTotal(mockItems, -10);
     expect(total).toBe(250); // Should ignore negative discount
  });

   it('should handle invalid discount (greater than 100)', () => {
     const total = CartCalculator.calculateTotal(mockItems, 110);
     expect(total).toBe(0); // Max discount is 100% (free) or should be capped? Let's say free.
  });
});
