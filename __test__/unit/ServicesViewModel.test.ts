
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useServicesViewModel } from '../../src/viewmodel/ServicesViewModel';
import { serviceUseCases, petUseCases, authUseCases } from '../../src/di/container';
import { useCart } from '../../src/usecase/Cart/CartContext';
import { Alert } from 'react-native';

// Mocks
jest.mock('../../src/di/container', () => ({
  authUseCases: {
    onAuthStateChanged: jest.fn(),
  },
  serviceUseCases: {
    getAllServices: jest.fn(),
  },
  petUseCases: {
    getAllPetsByClientId: jest.fn(),
  },
}));

jest.mock('../../src/usecase/Cart/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

// Mock Navigation
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: {} }),
  useNavigation: () => ({ setParams: jest.fn() }),
  useFocusEffect: jest.fn(),
}));

describe('useServicesViewModel', () => {
  const mockUser = { uID: 'user123', userName: 'Test' };
  const mockServices = [
    { id: 's1', name: 'Banho Simples', price: 50 },
    { id: 's2', name: 'Consulta Veterinária', price: 150 },
  ];
  const mockPets = [
    { id: 'p1', name: 'Rex', clientId: 'user123' },
  ];
  const mockAddItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (authUseCases.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      cb(mockUser);
      return jest.fn();
    });
    (serviceUseCases.getAllServices as jest.Mock).mockResolvedValue(mockServices);
    (petUseCases.getAllPetsByClientId as jest.Mock).mockResolvedValue(mockPets);
    (useCart as jest.Mock).mockReturnValue({ addItem: mockAddItem });
  });

  it('should load services and pets on mount', async () => {
    const { result } = renderHook(() => useServicesViewModel());

    await waitFor(() => {
      expect(result.current.pets).toEqual(mockPets);
      expect(result.current.selectedPet).toEqual(mockPets[0]);
    });
  });

  it('should filter services correctly', async () => {
    const { result } = renderHook(() => useServicesViewModel());

    await waitFor(() => {
        // Ensure services are loaded
        expect(result.current.displayBath.length).toBeGreaterThan(0);
    });

    // Test bath filter logic (implicit in displayBath/displayExams)
    // 'Banho Simples' should be in displayBath
    expect(result.current.displayBath).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Banho Simples' })])
    );
    // 'Consulta Veterinária' should be in displayExams
    expect(result.current.displayExams).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Consulta Veterinária' })])
    );
  });

  it('should add service to cart with confirmation', async () => {
    const { result } = renderHook(() => useServicesViewModel());

    await waitFor(() => {
      expect(result.current.selectedPet).not.toBeNull();
    });

    const serviceToAdd = mockServices[0];

    act(() => {
      result.current.addServiceToCart(serviceToAdd);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Confirmar Agendamento',
      expect.stringContaining(serviceToAdd.name),
      expect.any(Array)
    );

    // Simulate clicking "Confirmar"
    // Note: Jest spy on Alert doesn't easily allow simulating button press without more complex mocking.
    // For unit test coverage, ensuring Alert is called with correct params is often sufficient.
    // To go deeper, we'd need to mock Alert.alert implementation to call the callback.
    const alertCalls = (Alert.alert as jest.Mock).mock.calls;
    const confirmButton = alertCalls[0][2][1]; // 3rd arg is buttons array, 2nd button is Confirm
    
    act(() => {
        confirmButton.onPress();
    });

    expect(mockAddItem).toHaveBeenCalledWith(expect.objectContaining({
      id: serviceToAdd.id,
      petName: mockPets[0].name,
    }));
  });

  it('should alert if no user logged in', async () => {
    (authUseCases.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      cb(null);
      return jest.fn();
    });

    const { result } = renderHook(() => useServicesViewModel());
    
    act(() => {
        result.current.addServiceToCart(mockServices[0]);
    });

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Você precisa estar logado para enviar o pedido.');
  });
});
