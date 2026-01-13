import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ServiceCard from '../components/ServiceCard';
import PetTrackingCard from '../components/PetTrackingCard';
import { useHomeViewModel } from '../../viewmodel/HomeViewModel';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }: any) => {
  const {
    searchText,
    setSearchText,
    services,
    handleServicePress,
    goToOrderTracking,
  } = useHomeViewModel(navigation);
  const { isAdmin } = useAuth();

  const renderServiceItem = ({ item }: any) => (
    <View style={styles.serviceItem}>
      <ServiceCard
        icon={item.icon}
        title={item.title}
        onPress={() => handleServicePress(item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Header
          userName="usuário"
          searchValue={searchText}
          onSearchChange={setSearchText}
          onNotificationPress={() => console.log('Notificações')}
        />

        <View style={styles.content}>
          <Banner />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nossos serviços</Text>
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.servicesList}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acompanhe seu pet</Text>
            <PetTrackingCard
              icon="help-circle-outline"
              title="Seu pet não possui atendimentos."
              description=""
              onPress={goToOrderTracking}
            />
          </View>

          {isAdmin && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => navigation.navigate('AdminDashboard')}
                activeOpacity={0.8}
              >
                <View style={styles.adminButtonContent}>
                  <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
                  <Text style={styles.adminButtonText}>Painel Administrativo</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  servicesList: {
    justifyContent: 'space-between',
  },
  serviceItem: {
    flex: 1,
    maxWidth: '33.33%',
  },
  adminButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  adminButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomeScreen;