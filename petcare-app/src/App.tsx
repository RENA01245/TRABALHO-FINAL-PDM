import React from 'react';
import RootNavigator from './navigation/RootNavigator';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <CartProvider>
        <RootNavigator />
    </CartProvider>
  );
};

export default App;