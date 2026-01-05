import React from 'react';
import  RootNavigator  from './src/navigation/RootNavigator';
import { CartProvider } from './src/context/CartContext';

const App = () => {
  return (
    <CartProvider>
        <RootNavigator />
    </CartProvider>
  );
};

export default App;