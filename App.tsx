import React from 'react';
import  RootNavigator  from './src/navigation/RootNavigator';
import { CartProvider } from './src/usecase/Cart/CartContext';

const App = () => {
  return (
    <CartProvider>
        <RootNavigator />
    </CartProvider>
  );
};

export default App;