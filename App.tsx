import React from 'react';
import  RootNavigator  from './src/navigation/RootNavigator';
import { CartProvider } from './src/usecase/Cart/CartContext';
import { AlertProvider } from './src/view/context/AlertContext';

const App = () => {
  return (
    <AlertProvider>
      <CartProvider>
          <RootNavigator />
      </CartProvider>
    </AlertProvider>
  );
};

export default App;