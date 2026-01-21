import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions, ImageSourcePropType } from 'react-native';

interface BannerProps {
  source?: ImageSourcePropType;
  height?: number;
}

const Banner: React.FC<BannerProps> = ({
  source = { uri: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80' },
  height = 180,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={source}
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

