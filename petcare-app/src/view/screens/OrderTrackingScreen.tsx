import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type OrderStatus = 'Aguardando' | 'Em atendimento' | 'Finalizado';

interface OrderStep {
  status: OrderStatus;
  title: string;
  description: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}

const OrderTrackingScreen = () => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('Aguardando');

  const steps: OrderStep[] = [
    {
      status: 'Aguardando',
      title: 'Pedido Recebido',
      description: 'Seu pedido foi recebido e está aguardando processamento.',
      icon: 'time-outline',
    },
    {
      status: 'Em atendimento',
      title: 'Em Atendimento',
      description: 'Seu pedido está sendo processado e preparado.',
      icon: 'construct-outline',
    },
    {
      status: 'Finalizado',
      title: 'Pedido Finalizado',
      description: 'Seu pedido foi concluído com sucesso!',
      icon: 'checkmark-circle-outline',
    },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.status === currentStatus);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Aguardando':
        return '#FF9500';
      case 'Em atendimento':
        return '#2196F3';
      case 'Finalizado':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Acompanhar Pedido</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIconContainer,
              { backgroundColor: getStatusColor(currentStatus) + '20' },
            ]}
          >
            <Ionicons
              name={steps[currentStepIndex].icon}
              size={48}
              color={getStatusColor(currentStatus)}
            />
          </View>
          <Text style={styles.statusTitle}>{steps[currentStepIndex].title}</Text>
          <Text style={styles.statusDescription}>
            {steps[currentStepIndex].description}
          </Text>
        </View>

        <View style={styles.timeline}>
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <View key={step.status} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineIcon,
                      isCompleted && {
                        backgroundColor: getStatusColor(step.status),
                      },
                      isCurrent && styles.timelineIconCurrent,
                    ]}
                  >
                    <Ionicons
                      name={step.icon}
                      size={20}
                      color={isCompleted ? '#FFF' : '#999'}
                    />
                  </View>
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        isCompleted && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      isCompleted && styles.timelineTitleCompleted,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.timelineDescription}>
                    {step.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {currentStatus === 'Finalizado' && (
          <View style={styles.finalMessage}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.finalMessageTitle}>
              Pedido Concluído!
            </Text>
            <Text style={styles.finalMessageText}>
              Obrigado por escolher o PetCare. Esperamos vê-lo novamente! 🐾
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.simulateButton}
          onPress={() => {
            const nextIndex = (currentStepIndex + 1) % steps.length;
            setCurrentStatus(steps[nextIndex].status);
          }}
        >
          <Text style={styles.simulateButtonText}>
            {currentStatus === 'Finalizado'
              ? 'Reiniciar Simulação'
              : 'Avançar Status (Simulação)'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  timeline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCurrent: {
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
    minHeight: 40,
  },
  timelineLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  timelineTitleCompleted: {
    color: '#333',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
  },
  finalMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  finalMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
  finalMessageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  simulateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  simulateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderTrackingScreen;

