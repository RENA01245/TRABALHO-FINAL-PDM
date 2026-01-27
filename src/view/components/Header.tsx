import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from './SearchBar';

interface HeaderProps {
  userName?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onNotificationPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = 'usuário',
  searchValue,
  onSearchChange,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.greeting}>Olá, {userName}</Text>
        <TouchableOpacity
          style={styles.notificationButton}
        >
          <Ionicons name="notifications-outline" size={24} color="#333"/>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>0</Text>
          </View>
        </TouchableOpacity>
      </View>
      <SearchBar value={searchValue} onChangeText={onSearchChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  greeting: {
    fontSize: 24,
    paddingTop: 15,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  notificationButton: {
    paddingTop: 15,
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;