import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    breed: string;
    age: number;
    image: string;
  };
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: pet.image }} style={styles.image} />
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.details}>{pet.breed}</Text>
      <Text style={styles.details}>{pet.age} years old</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
});

export default PetCard;