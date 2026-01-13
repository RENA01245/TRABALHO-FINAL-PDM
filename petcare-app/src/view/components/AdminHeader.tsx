import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdminHeaderProps {
  onProfilePress?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onProfilePress }) => {
  const getCurrentDate = () => {
    const today = new Date();
    const days = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const dayName = days[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];

    return `${dayName}, ${day} de ${month}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Olá, Administrador</Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onProfilePress}
        >
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#4CAF50" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    paddingTop: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    paddingTop: 15,
    padding: 8,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
});

export default AdminHeader;

