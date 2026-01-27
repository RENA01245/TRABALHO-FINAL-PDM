import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    searchResults,
    isSearching,
    goToProductDetails,
    refreshing,
    onRefresh
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

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      );
    }

    if (!searchResults) return null;

    const { products, services } = searchResults;

    if (products.length === 0 && services.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
        </View>
      );
    }

    return (
      <View style={styles.searchResultsContainer}>
        {services.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Serviços</Text>
            {services.map(service => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.resultItem}
                onPress={() => {
                   if (service.name.toLowerCase().includes('banho') || service.name.toLowerCase().includes('tosa')) {
                      navigation.navigate('Services', { screen: 'Services', params: { filter: 'bath' } });
                   } else {
                      navigation.navigate('Services', { screen: 'Services', params: { filter: 'health' } });
                   }
                }}
              >
                <View style={styles.iconContainer}>
                   <Ionicons name={service.name.toLowerCase().includes('banho') ? 'water' : 'medical'} size={24} color="#E53935" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.resultTitle}>{service.name}</Text>
                  <Text style={styles.resultSubtitle}>{service.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {products.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Produtos</Text>
            {products.map(product => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.resultItem}
                onPress={() => goToProductDetails(product)}
              >
                <View style={styles.iconContainer}>
                   <Ionicons name="cube" size={24} color="#E53935" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.resultTitle}>{product.name}</Text>
                  <Text style={styles.resultSubtitle}>R$ {product.price.toFixed(2)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E53935']} // Cor para Android
            tintColor="#E53935" // Cor para iOS
          />
        }
      >
        <Header
          userName={currentUser?.userName || "Visitante"}
          searchValue={searchText}
          onSearchChange={setSearchText}
          onNotificationPress={() => console.log('Notificações')}
        />

        <View style={styles.content}>
          {(searchResults || isSearching) ? renderSearchResults() : (
            <>
              <Banner 
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
            </>
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
  // Search Styles
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  searchResultsContainer: {
    marginTop: 20,
  },
  resultSection: {
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default HomeScreen;
