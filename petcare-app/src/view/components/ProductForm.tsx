import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Product from '../../model/entities/product';

interface ProductFormProps {
  initial?: Partial<Product>;
  onCancel: () => void;
  onSave: (data: { name: string; price: number; description?: string | null; imageUrl?: string | null }) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initial = {}, onCancel, onSave }) => {
  const [name, setName] = useState(initial.name ?? '');
  const [price, setPrice] = useState(initial.price ? String(initial.price) : '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [imageUrl, setImageUrl] = useState(initial.imageUrl ?? '');

  useEffect(() => {
    setName(initial.name ?? '');
    setPrice(initial.price ? String(initial.price) : '');
    setDescription(initial.description ?? '');
    setImageUrl(initial.imageUrl ?? '');
  }, [initial]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome do produto é obrigatório');
      return;
    }
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Erro', 'Informe um preço válido');
      return;
    }

    onSave({
      name: name.trim(),
      price: parsedPrice,
      description: description.trim() || null,
      imageUrl: imageUrl.trim() || null,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Preço</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>URL da imagem</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
  },
  multiline: {
    height: 80,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  cancel: {
    backgroundColor: '#eee',
    marginRight: 8,
  },
  save: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductForm;
