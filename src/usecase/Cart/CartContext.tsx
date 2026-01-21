import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'service';
  image?: string;
  petName?: string;
  petId?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, petId?: string) => void;
  updateQuantity: (id: string, quantity: number, petId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prevItems) => {
      // Find item with same ID AND same petId (if applicable)
      const existingItem = prevItems.find((i) => {
        const sameId = i.id === item.id;
        const samePet = i.petId === item.petId;
        // For products (no petId), samePet is true (undefined === undefined)
        return sameId && samePet;
      });
      
      if (existingItem) {
        return prevItems.map((i) => {
          const sameId = i.id === item.id;
          const samePet = i.petId === item.petId;
          
          return (sameId && samePet)
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i;
        });
      }
      
      return [...prevItems, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (id: string, petId?: string) => {
    setItems((prevItems) => prevItems.filter((item) => {
      const sameId = item.id === id;
      const samePet = item.petId === petId;
      // Remove if it matches both ID and PetID
      return !(sameId && samePet);
    }));
  };

  const updateQuantity = (id: string, quantity: number, petId?: string) => {
    if (quantity <= 0) {
      removeItem(id, petId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) => {
        const sameId = item.id === id;
        const samePet = item.petId === petId;
        
        return (sameId && samePet) ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

