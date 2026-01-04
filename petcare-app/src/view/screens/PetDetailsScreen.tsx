import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  PetDetails: {
    pet: {
      id: string;
      name: string;
      breed: string;
      age: number;
      image: string;
      description?: string;
    };
  };
};

type PetDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PetDetails'>;

interface PetDetailsScreenProps {
  route: PetDetailsScreenRouteProp;
}

const PetDetailsScreen: React.FC<PetDetailsScreenProps> = ({ route }) => {
  const { pet } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: pet.image }} style={styles.image} />
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.description}>{pet.description}</Text>
      <Text style={styles.age}>Age: {pet.age} years</Text>
      <Text style={styles.breed}>Breed: {pet.breed}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    marginVertical: 5,
  },
  age: {
    fontSize: 16,
    marginVertical: 5,
  },
  breed: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default PetDetailsScreen;