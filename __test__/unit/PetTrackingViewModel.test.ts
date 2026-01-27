
import { renderHook, waitFor } from '@testing-library/react-native';
import { useOrderTrackingViewModel } from '../../src/viewmodel/PetTrackingViewModel';
import { authUseCases, trackingUseCases } from '../../src/di/container';

jest.mock('../../src/di/container', () => ({
  authUseCases: {
    onAuthStateChanged: jest.fn(),
  },
  trackingUseCases: {
    getPetTracking: jest.fn(),
  },
}));

describe('useOrderTrackingViewModel', () => {
  const mockUser = { uID: 'user123' };
  const mockAttendances = [{ id: '1', status: 'em_banho' }];

  beforeEach(() => {
    jest.clearAllMocks();
    (authUseCases.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      cb(mockUser);
      return jest.fn(); // unsubscribe function
    });
    (trackingUseCases.getPetTracking as jest.Mock).mockResolvedValue(mockAttendances);
  });

  it('should load tracking data when user is logged in', async () => {
    const { result } = renderHook(() => useOrderTrackingViewModel());

    await waitFor(() => {
      expect(result.current.attendances).toEqual(mockAttendances);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should return correct status details', () => {
    const { result } = renderHook(() => useOrderTrackingViewModel());
    
    const details = result.current.getStatusDetails('em_banho');
    expect(details.desc).toContain('Hora da limpeza');
    
    const unknown = result.current.getStatusDetails('desconhecido');
    expect(unknown.desc).toContain('Status em atualização');
  });
});
