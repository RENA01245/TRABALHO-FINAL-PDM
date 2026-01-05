import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Service from '../../model/entities/service';
import { useServicesViewModel } from '../../viewmodel/ServicesViewModel';

const ServicesScreen = () => {
  const {
    pets,
    selectedPet,
    showPetModal,
    setShowPetModal,

    examAndConsultationServices,
    bathAndGroomingServices,

    selectPet,
    addServiceToCart,
  } = useServicesViewModel();

  const renderService = ({ item }: { item: Service }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceInfo}>
        <Ionicons name="paw" size={32} color="#4CAF50" />
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceDescription}>{item.description}</Text>
          <Text style={styles.servicePrice}>
            R$ {(item.price ?? 0).toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={() => addServiceToCart(item)}
      >
        <Text style={styles.scheduleButtonText}>Agendar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Serviços</Text>

        <TouchableOpacity
          style={styles.petSelector}
          onPress={() => setShowPetModal(true)}
        >
          <Ionicons name="paw" size={20} color="#4CAF50" />
          <Text style={styles.petSelectorText}>
            {selectedPet ? selectedPet.name : 'Selecione um Pet'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agende exames e consultas</Text>
        <FlatList
          data={examAndConsultationServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Faça o agendamento</Text>
        <FlatList
          data={bathAndGroomingServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Modal visible={showPetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione seu pet</Text>

            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petOption}
                onPress={() => selectPet(pet)}
              >
                <Ionicons name="paw" size={24} color="#4CAF50" />
                <Text style={styles.petOptionText}>
                  {pet.name} - {pet.breed}
                </Text>

                {selectedPet?.id === pet.id && (
                  <Ionicons name="checkmark" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPetModal(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F5F5F5', }, header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', }, headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 12, }, petSelector: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, }, petSelectorText: { flex: 1, fontSize: 16, color: '#333', fontWeight: '600', }, section: { marginTop: 20, paddingHorizontal: 20, }, sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16, }, list: { paddingBottom: 20, }, serviceCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, }, serviceInfo: { flexDirection: 'row', flex: 1, gap: 12, }, serviceDetails: { flex: 1, }, serviceName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4, }, serviceDescription: { fontSize: 14, color: '#666', marginBottom: 8, }, servicePrice: { fontSize: 16, fontWeight: '600', color: '#4CAF50', }, scheduleButton: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, }, scheduleButtonText: { color: '#FFF', fontWeight: '600', fontSize: 14, }, modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', }, modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%', }, modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, }, petOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8, backgroundColor: '#F5F5F5', marginBottom: 12, gap: 12, }, petOptionText: { flex: 1, fontSize: 16, color: '#333', }, closeButton: { marginTop: 20, padding: 16, backgroundColor: '#4CAF50', borderRadius: 8, alignItems: 'center', }, closeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600', }, }); export default ServicesScreen;