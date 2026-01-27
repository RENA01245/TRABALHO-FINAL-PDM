
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useHomeViewModel } from '../../src/viewmodel/HomeViewModel';
import { authUseCases, trackingUseCases, productUseCases, serviceUseCases } from '../../src/di/container';

// Mocks
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(), // Don't run immediately to avoid state update during render
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('../../src/di/container', () => ({
  authUseCases: {
    onAuthStateChanged: jest.fn(),
  },
  trackingUseCases: {
    getPetTracking: jest.fn(),
  },
  productUseCases: {
    getAllProducts: jest.fn(),
  },
  serviceUseCases: {
    getAllServices: jest.fn(),
  },
}));

jest.useFakeTimers();

describe('useHomeViewModel', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockUser = { uID: 'user123', userName: 'Test User' };
  const mockAttendances = [{ id: '1', petName: 'Rex', status: 'em_banho' }];
  const mockProducts = [{ id: 'p1', name: 'Ração', price: 50 }];
  const mockServices = [{ id: 's1', name: 'Banho', price: 30 }];

  beforeEach(() => {
    jest.clearAllMocks();
    (authUseCases.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      cb(mockUser);
      return jest.fn();
    });
    (trackingUseCases.getPetTracking as jest.Mock).mockResolvedValue(mockAttendances);
    (productUseCases.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
    (serviceUseCases.getAllServices as jest.Mock).mockResolvedValue(mockServices);
  });

  it('should initialize with user and load attendances via refresh', async () => {
    const { result } = renderHook(() => useHomeViewModel(mockNavigation));

    await waitFor(() => {
      expect(result.current.currentUser).toEqual(mockUser);
    });

    // Manually trigger refresh to simulate data fetching
    await act(async () => {
      await result.current.onRefresh();
    });

    expect(trackingUseCases.getPetTracking).toHaveBeenCalledWith(mockUser.uID);
    expect(result.current.attendances).toEqual(mockAttendances);
  });

  it('should handle search with debounce', async () => {
    const { result } = renderHook(() => useHomeViewModel(mockNavigation));

    act(() => {
      result.current.setSearchText('Ração');
    });

    // Fast-forward debounce
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(productUseCases.getAllProducts).toHaveBeenCalled();
      expect(serviceUseCases.getAllServices).toHaveBeenCalled();
    });

    expect(result.current.searchResults?.products).toEqual(mockProducts);
    expect(result.current.searchResults?.services).toEqual([]);
  });

  it('should navigate correctly on service press', () => {
    const { result } = renderHook(() => useHomeViewModel(mockNavigation));

    result.current.handleServicePress('1');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Services', { screen: 'Services', params: { filter: 'bath' } });

    result.current.handleServicePress('2');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Services', { screen: 'Services', params: { filter: 'health' } });

    result.current.handleServicePress('3');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Shop');
  });

  it('should navigate to order tracking if user is logged in', () => {
    const { result } = renderHook(() => useHomeViewModel(mockNavigation));

    // Ensure user is set
    act(() => {
        // This relies on auth state change in beforeEach
    });

    result.current.goToOrderTracking();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('OrderTracking');
  });

  it('should navigate to login if user is not logged in when clicking order tracking', async () => {
    (authUseCases.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      cb(null);
      return jest.fn();
    });

    const { result } = renderHook(() => useHomeViewModel(mockNavigation));
    
    // Wait for initial auth check
    await waitFor(() => {
        expect(result.current.currentUser).toBeNull();
    });

    result.current.goToOrderTracking();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});
