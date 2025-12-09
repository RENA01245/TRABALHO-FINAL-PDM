import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PetCard from '../components/PetCard';

const HomeScreen = () => {
  const pets = [
    { id: '1', name: 'Buddy', breed: 'Golden Retriever' },
    { id: '2', name: 'Mittens', breed: 'Siamese Cat' },
    { id: '3', name: 'Charlie', breed: 'Beagle' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Listings</Text>
      <FlatList
        data={pets}
        renderItem={({ item }) => <PetCard pet={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;