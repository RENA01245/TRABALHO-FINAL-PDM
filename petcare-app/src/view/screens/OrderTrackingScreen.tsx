// screens/OrderTrackingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrderTrackingViewModel } from '../../viewmodel/PetTrackingViewModel';

const OrderTrackingScreen = () => {
  const { attendances, getStatusDetails } = useOrderTrackingViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Acompanhamento em Tempo Real</Text>
      </View>

      <FlatList
        data={attendances}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => {
          const details = getStatusDetails(item.status);
          return (
            <View style={styles.petCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.petName}>{item.petName}</Text>
                <Text style={styles.serviceTag}>{item.serviceName}</Text>
              </View>
              
              <View style={[styles.statusBox, { backgroundColor: details.color + '15' }]}>
                <Ionicons name={details.icon as any} size={40} color={details.color} />
                <View style={styles.statusTexts}>
                  <Text style={[styles.statusTitle, { color: details.color }]}>{item.status}</Text>
                  <Text style={styles.statusDesc}>{details.desc}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  petCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 20, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  serviceTag: { fontSize: 12, color: '#666', backgroundColor: '#EEE', padding: 4, borderRadius: 5 },
  statusBox: { flexDirection: 'row', padding: 15, borderRadius: 12, alignItems: 'center' },
  statusTexts: { marginLeft: 15, flex: 1 },
  statusTitle: { fontSize: 16, fontWeight: 'bold' },
  statusDesc: { fontSize: 13, color: '#666' }
});

export default OrderTrackingScreen;