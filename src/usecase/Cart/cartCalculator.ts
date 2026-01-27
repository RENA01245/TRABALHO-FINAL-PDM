
import { CartItem } from './CartContext';

export class CartCalculator {
  static calculateTotal(items: CartItem[], discountPercent: number = 0): number {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    
    if (discountPercent < 0) {
      return subtotal;
    }

    if (discountPercent > 100) {
      return 0;
    }

    const discountAmount = subtotal * (discountPercent / 100);
    return subtotal - discountAmount;
  }
}
