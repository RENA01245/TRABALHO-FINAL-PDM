import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Alert, Modal, ActivityIndicator } from 'react-native';
import ProtectedRoute from '../components/ProtectedRoute';
import Product from '../../model/entities/product';
import ProductForm from '../components/ProductForm';
import { productUseCases } from '../../di/container';

const AdminProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const all = await productUseCases.getAllProducts();
      setProducts(all);
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert('Erro', error.message || 'Falha ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirmar', 'Deseja realmente excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await productUseCases.deleteProduct(id);
            Alert.alert('Sucesso', 'Produto excluído');
            loadProducts();
          } catch (error: any) {
            console.error('Erro ao excluir produto:', error);
            Alert.alert('Erro', error.message || 'Falha ao excluir produto');
          }
        }
      }
    ]);
  };

  const handleSave = async (data: { name: string; price: number; description?: string | null; imageUrl?: string | null }) => {
    try {
      if (editing) {
        await productUseCases.updateProduct(editing.id, data);
        Alert.alert('Sucesso', 'Produto atualizado');
      } else {
        await productUseCases.createProduct(data);
        Alert.alert('Sucesso', 'Produto criado');
      }
      setShowForm(false);
      loadProducts();
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert('Erro', error.message || 'Falha ao salvar produto');
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : null}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.delete]} onPress={() => handleDelete(item.id)}>
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ProtectedRoute requireAdmin={true}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gerenciar Produtos</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
            <Text style={styles.addText}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}

        <Modal visible={showForm} animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
              <ProductForm
                initial={editing ?? undefined}
                onCancel={() => setShowForm(false)}
                onSave={handleSave}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  addButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 6 },
  addText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#666', marginTop: 4 },
  actions: { flexDirection: 'row' },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 6, marginLeft: 8 },
  actionText: { color: '#333', fontWeight: 'bold' },
  delete: { backgroundColor: '#FF3B30' },
});

export default AdminProductsScreen;
