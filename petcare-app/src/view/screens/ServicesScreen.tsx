import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
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
      <ScrollView>
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agende exames e consultas</Text>
          <FlatList
            data={examAndConsultationServices}
            renderItem={renderService}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
          <Text style={styles.sectionTitle}>Agende Banho e tosa</Text>
          <FlatList
            data={bathAndGroomingServices}
            renderItem={renderService}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
      </View>
      </ScrollView>

      <Modal visible={showPetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione seu pet</Text>

            {pets.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="paw-outline" size={48} color="#999" />
                <Text style={styles.emptyStateText}>
                  Nenhum pet cadastrado
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Cadastre um pet para agendar serviços
                </Text>
              </View>
            ) : (
              pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petOption}
                  onPress={() => selectPet(pet)}
                >
                  <Ionicons name="paw" size={24} color="#4CAF50" />
                  <Text style={styles.petOptionText}>
                    {pet.name} - {pet.breed || 'Sem raça definida'}
                  </Text>

                  {selectedPet?.id === pet.id && (
                    <Ionicons name="checkmark" size={24} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))
            )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // --- Header & Pet Selector ---
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    marginBottom: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  petSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  petSelectorText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // --- Sections & Lists ---
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  // --- Service Cards ---
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    // Shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDescription: {
    marginBottom: 8,
    paddingRight: 15,
    fontSize: 12,
    color: '#666',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  // --- Buttons ---
  scheduleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    maxHeight: '50%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  petOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  petOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ServicesScreen;