import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AdminHeader from '../components/AdminHeader';
import SearchBar from '../components/SearchBar';
import ServiceCard from '../components/ServiceCard';
import AppointmentCard from '../components/AppointmentCard';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAdminDashboardViewModel } from '../../viewmodel/AdminDashboardViewModel';

const AdminDashboardScreen = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState('');
  const { isAuthorized, loading } = useAdminDashboardViewModel();

  const menuActions = [
    {
      id: '1',
      icon: 'people-outline' as const,
      title: 'Nossos Clientes',
      onPress: () => console.log('Nossos Clientes'),
    },
    {
      id: '2',
      icon: 'calendar-outline' as const,
      title: 'Agendamentos',
      onPress: () => console.log('Agendamentos'),
    },
    {
      id: '3',
      icon: 'cube-outline' as const,
      title: 'Produtos',
      onPress: () => navigation.navigate('AdminProducts'),
    },

    {
      id: '4',
      icon: 'paw-outline' as const,
      title: 'Nossos Serviços',
      onPress: () => console.log('Nossos Serviços'),
    },
  ];

  const todayAppointments = [
    {
      id: '1',
      time: '09:00',
      petName: 'Rex',
      tutorName: 'João Silva',
      service: 'Banho e Tosa',
      status: 'Confirmado',
    },
    {
      id: '2',
      time: '10:30',
      petName: 'Luna',
      tutorName: 'Maria Santos',
      service: 'Consulta Veterinária',
      status: 'Confirmado',
    },
    {
      id: '3',
      time: '14:00',
      petName: 'Thor',
      tutorName: 'Pedro Oliveira',
      service: 'Vacinação',
      status: 'Pendente',
    },
    {
      id: '4',
      time: '15:30',
      petName: 'Bella',
      tutorName: 'Ana Costa',
      service: 'Banho e Tosa',
      status: 'Confirmado',
    },
  ];

  const renderMenuAction = ({ item }: any) => (
    <View style={styles.menuItem}>
      <ServiceCard
        icon={item.icon}
        title={item.title}
        onPress={item.onPress}
      />
    </View>
  );

  const renderAppointment = ({ item }: any) => (
    <AppointmentCard
      time={item.time}
      petName={item.petName}
      tutorName={item.tutorName}
      service={item.service}
      status={item.status}
      onPress={() => console.log('Appointment pressed:', item.id)}
    />
  );

  // BACKEND: Validação real - se não for autorizado, não renderiza conteúdo
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Verificando permissões...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthorized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Acesso Negado</Text>
          <Text style={styles.errorSubtext}>
            Você não tem permissão para acessar esta área.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <AdminHeader onProfilePress={() => console.log('Perfil')} />

        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="O que está procurando?"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ações Principais</Text>
            <FlatList
              data={menuActions}
              renderItem={renderMenuAction}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.menuList}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agendamentos de Hoje</Text>
            <FlatList
              data={todayAppointments}
              renderItem={renderAppointment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </ProtectedRoute>
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
  searchContainer: {
    marginTop: 8,
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
  menuList: {
    justifyContent: 'space-between',
  },
  menuItem: {
    flex: 1,
    maxWidth: '50%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AdminDashboardScreen;

