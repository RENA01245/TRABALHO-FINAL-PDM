import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SettingsScreen = () => {
  const handleSaveSettings = () => {
    // Logic to save settings goes here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {/* Add settings options here */}
      <Button title="Save Settings" onPress={handleSaveSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default SettingsScreen;