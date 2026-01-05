import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type OrderStatus = 'Aguardando' | 'Em atendimento' | 'Finalizado';

export interface OrderStep {
  status: OrderStatus;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const useOrderTrackingViewModel = () => {
  const [currentStatus, setCurrentStatus] =
    useState<OrderStatus>('Aguardando');

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

  const getCurrentStepIndex = () =>
    steps.findIndex(step => step.status === currentStatus);

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

  const advanceStatus = () => {
    const currentIndex = getCurrentStepIndex();
    const nextIndex = (currentIndex + 1) % steps.length;
    setCurrentStatus(steps[nextIndex].status);
  };

  return {
    steps,
    currentStatus,
    currentStepIndex: getCurrentStepIndex(),
    getStatusColor,
    advanceStatus,
  };
};
