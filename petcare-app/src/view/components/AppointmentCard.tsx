import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppointmentCardProps {
  time: string;
  petName: string;
  tutorName: string;
  service: string;
  status: string;
  onPress?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  time,
  petName,
  tutorName,
  service,
  status,
  onPress,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmado':
        return '#4CAF50';
      case 'pendente':
        return '#FF9500';
      case 'cancelado':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={20} color="#4CAF50" />
          <Text style={styles.time}>{time}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.tutorName}>{tutorName}</Text>
          <Text style={styles.service}>{service}</Text>
        </View>

        <View
          style={[
            styles.badge,
            { backgroundColor: getStatusColor(status) },
          ]}
        >
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 6,
  },
  infoContainer: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tutorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  service: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AppointmentCard;

