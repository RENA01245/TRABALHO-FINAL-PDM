import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ServiceCard from '../components/ServiceCard';
import PetTrackingCard from '../components/PetTrackingCard';
import { useHomeViewModel } from '../../viewmodel/HomeViewModel';

const HomeScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const {
    searchText,
    setSearchText,
    services,
    handleServicePress,
    goToOrderTracking,
    attendances,
    hasAttendance,
    currentUser,
  } = useHomeViewModel(navigation);

  const [activeSlide, setActiveSlide] = useState(0);

  const renderServiceItem = ({ item }: any) => (
    <View style={styles.serviceItem}>
      <ServiceCard
        icon={item.icon}
        title={item.title}
        onPress={() => handleServicePress(item.id)}
      />
    </View>
  );

  const renderAttendanceItem = ({ item }: any) => (
    <View style={styles.carouselItem}>
      <PetTrackingCard
        icon="paw"
        title={`${item.petName} está em atendimento`}
        description={`Status: ${item.status} (${item.serviceName})`}
        onPress={goToOrderTracking}
      />
    </View>
  );

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveSlide(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Header
          userName={currentUser?.userName || "Visitante"}
          searchValue={searchText}
          onSearchChange={setSearchText}
          onNotificationPress={() => console.log('Notificações')}
        />

        <View style={styles.content}>
          <Banner 
            // Exemplo de como usar imagem:
            // Local: source={require('../../assets/seu-banner.png')}
            // Remota: source={{ uri: 'https://...' }}
            source={{ uri: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80' }}
          />

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
            
            {hasAttendance ? (
              <View>
                <FlatList
                  data={attendances}
                  renderItem={renderAttendanceItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                  scrollEventThrottle={16}
                />
                {attendances.length > 1 && (
                  <View style={styles.pagination}>
                    {attendances.map((_: any, index: number) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          index === activeSlide
                            ? styles.paginationDotActive
                            : styles.paginationDotInactive,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <PetTrackingCard
                icon="help-circle-outline"
                title="Seu pet não possui atendimentos."
                description="Toque para ver o histórico."
                onPress={goToOrderTracking}
              />
            )}
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
  carouselItem: {
    // Width set dynamically via style prop
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#E53935',
  },
  paginationDotInactive: {
    backgroundColor: '#C8C8C8',
  },
});

export default HomeScreen;
