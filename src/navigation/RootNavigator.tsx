import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../view/screens/HomeScreen';
import ShopScreen from '../view/screens/ShopScreen';
import ProductDetailsScreen from '../view/screens/ProductDetailsScreen';
import ServicesScreen from '../view/screens/ServicesScreen';
import CartScreen from '../view/screens/CartScreen';
import OrderTrackingScreen from '../view/screens/OrderTrackingScreen';
import SettingsScreen from '../view/screens/SettingsScreen';
import CartTabIcon from '../view/components/CartTabIcon';
import PetDetailsScreen from '../view/screens/PetDetailsScreen';
import LoginScreen from '../view/screens/LoginScreen';
import SignUpScreen from '../view/screens/SignUpScreen';
import Product from '../model/entities/product';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

type ShopStackParamList = {
  Shop: undefined;
  ProductDetails: { product: Product };
};

const ShopStackNavigator = createStackNavigator<ShopStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: 'Acompanhar Pedido' }}
      />
    </Stack.Navigator>
  );
};

const ShopStack = () => {
  return (
    <ShopStackNavigator.Navigator>
      <ShopStackNavigator.Screen
        name="Shop"
        component={ShopScreen}
        options={{ headerShown: false }}
      />
      <ShopStackNavigator.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Detalhes do Produto' }}
      />
    </ShopStackNavigator.Navigator>
  );
};

const ServicesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Meu Perfil' }}
      />
    </Stack.Navigator>
  );
};

const CartStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Cart') {
            return <CartTabIcon focused={focused} color={color} size={size} />;
          }

          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E53935',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          paddingBottom: 15,
          paddingTop: 5,
          height: 80,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Início' }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopStack}
        options={{ title: 'Loja' }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{ title: 'Serviços' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{ title: 'Carrinho' }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsStack}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'petcare://'],
  config: {
    screens: {
      // Outras rotas se necessário
    },
  },
};

const RootNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PetDetails"
          component={PetDetailsScreen as any}
          options={{ title: 'Detalhes do Pet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
