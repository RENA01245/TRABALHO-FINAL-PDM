import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Product from '../../model/entities/product';
import { useShopViewModel } from '../../viewmodel/ShopViewModel';

const ShopScreen = ({ navigation }: any) => {
  const { products, addProductToCart } = useShopViewModel();

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate('ProductDetails', { product: item })
      }
    >
      <Image
        source={{ uri: item.imageUrl ?? '' }}
        style={styles.productImage}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.productPrice}>
          R$ {item.price.toFixed(2)}
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addProductToCart(item)}
        >
          <Ionicons name="cart-outline" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Produtos</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // --- Header Section ---
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  // --- List & Grid ---
  list: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  // --- Card Styling ---
  productCard: {
    width: '48%',
    margin: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    // Sombra (Android)
    elevation: 2,
    // Sombra (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 9,
  },
  // --- Product Details ---
  productName: {
    minHeight: 40,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  // --- Buttons ---
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default ShopScreen;
