import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

interface BannerProps {
  imageUrl?: string;
  height?: number;
}

const { width } = Dimensions.get('window');

const Banner: React.FC<BannerProps> = ({
  imageUrl = 'https://via.placeholder.com/400x200?text=Banner+PetCare',
  height = 180,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { height }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    borderRadius: 12,
  },
});

export default Banner;

