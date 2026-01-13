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
    displayExams,
    displayBath,
    setShowPetModal,
    selectPet,
    addServiceToCart,
    activeFilter,
    setActiveFilter,
    categories,
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
        <Text style={styles.clearText}>Filtros</Text>
        {/* NOVO: Seletor de Categorias em Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              onPress={() => setActiveFilter(cat.id as any)}
              style={[
                styles.filterChip,
                activeFilter === cat.id && styles.filterChipActive
              ]}
            >
              <Ionicons 
                name={cat.icon as any} 
                size={16} 
                color={activeFilter === cat.id ? '#FFF' : '#4CAF50'} 
              />
              <Text style={[
                styles.filterChipText,
                activeFilter === cat.id && styles.filterChipTextActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.petSelector}
          onPress={() => setShowPetModal(true)}
        >
          <View style={styles.petSelectorLeft}>
            <Ionicons name="paw" size={20} color="#4CAF50" />
            <View>
              <Text style={styles.petSelectorLabel}>Agendando para:</Text>
              <Text style={styles.petSelectorText}>
                {selectedPet ? selectedPet.name : 'Selecione um Pet'}
              </Text>
            </View>
          </View>
          <Ionicons name="swap-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.section}>
          {displayExams.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Consultas e Procedimentos</Text>
              <FlatList
                data={displayExams}
                renderItem={renderService}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
          {displayBath.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Estética e Higiene</Text>
              <FlatList
                data={displayBath}
                renderItem={renderService}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
          {displayExams.length === 0 && displayBath.length === 0 && (
            <Text style={styles.emptyText}>Nenhum serviço encontrado nesta categoria.</Text>
          )}
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // --- Header & Pet Selector ---
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
    paddingVertical: 5,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F9F1',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800', // Um pouco mais de peso
    color: '#1A1A1A',
  },
  filterStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  filterSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  clearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Verde bem clarinho
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginTop: 20,
    gap: 6,
  },
  clearText: {
    color: '#2E7D32', // Verde mais escuro para contraste
    fontSize: 13,
    fontWeight: '700',
  },
  petSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  petSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petSelectorLabel: {
    fontSize: 10,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  petSelectorText: {
    fontSize: 15,
    fontWeight: '700',
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
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

export default ServicesScreen;