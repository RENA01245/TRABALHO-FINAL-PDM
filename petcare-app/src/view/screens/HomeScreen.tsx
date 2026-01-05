import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ServiceCard from '../components/ServiceCard';
import PetTrackingCard from '../components/PetTrackingCard';
import { useHomeViewModel } from '../../viewmodel/HomeViewModel';

const HomeScreen = ({ navigation }: any) => {
  const {
    searchText,
    setSearchText,
    services,
    handleServicePress,
    goToOrderTracking,
  } = useHomeViewModel(navigation);

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
});

export default HomeScreen;