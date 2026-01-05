import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../../context/CartContext';
import { useCartViewModel } from '../../viewmodel/CartViewModel';

const CartScreen = () => {
  const {
    items,
    formatPrice,
    updateQuantity,
    removeItem,
    getTotal,
    sendOrderToWhatsApp,
  } = useCartViewModel();

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <View style={styles.itemIconContainer}>
          <Ionicons name="paw" size={32} color="#4CAF50" />
        </View>
      )}

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.petName && <Text style={styles.itemPet}>Pet: {item.petName}</Text>}
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>

      <View style={styles.itemControls}>
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <Ionicons name="remove" size={18} />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <Ionicons name="add" size={18} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrinho ({items.length})</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#CCC" />
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatPrice(getTotal())}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={sendOrderToWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
              <Text style={styles.checkoutButtonText}>
                Finalizar pedido via WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F5F5F5', }, header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', }, headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', }, list: { padding: 16, }, cartItem: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, }, itemImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#E0E0E0', marginRight: 12, }, itemIconContainer: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12, }, itemInfo: { flex: 1, justifyContent: 'center', }, itemName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4, }, itemPet: { fontSize: 14, color: '#666', marginBottom: 4, }, itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', }, itemControls: { alignItems: 'center', justifyContent: 'space-between', gap: 12, }, quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, padding: 4, gap: 12, }, quantityButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', }, quantityText: { fontSize: 16, fontWeight: '600', color: '#333', minWidth: 24, textAlign: 'center', }, removeButton: { padding: 8, }, footer: { backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderTopColor: '#E0E0E0', }, totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, }, totalLabel: { fontSize: 20, fontWeight: '600', color: '#333', }, totalValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', }, checkoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', paddingVertical: 16, borderRadius: 12, gap: 8, }, checkoutButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', }, emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, }, emptyText: { fontSize: 20, fontWeight: '600', color: '#666', marginTop: 20, marginBottom: 8, }, emptySubtext: { fontSize: 16, color: '#999', textAlign: 'center', }, });
export default CartScreen;