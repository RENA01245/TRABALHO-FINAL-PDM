
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSettingsViewModel } from '../../src/viewmodel/SettingsViewModel';
import { petUseCases, authUseCases } from '../../src/di/container';
import { storageService } from '../../src/infra/services/supabase/supabaseStorageService';
import { Alert } from 'react-native';

jest.mock('../../src/di/container', () => ({
  authUseCases: {
    onAuthStateChanged: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
  },
  petUseCases: {
    getAllPetsByClientId: jest.fn(),
    createPet: jest.fn(),
  },
}));

jest.mock('../../src/infra/services/supabase/supabaseStorageService', () => ({
  storageService: {
    uploadImage: jest.fn(),
  },
}));

jest.spyOn(Alert, 'alert');
    jest.mock('@react-navigation/native', () => ({
        useFocusEffect: jest.fn(),
    }));
    
    describe('useSettingsViewModel', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockUser = { uID: 'user123', userName: 'Test', telefone: '123' };
  const mockPets = [{ id: 'p1', name: 'Rex', clientId: 'user123' }];

  beforeEach(() => {
    jest.clearAllMocks();
    (authUseCases.onAuthStateChanged as jest.Mock).mockImplementation((cb) => {
      cb(mockUser);
      return jest.fn();
    });
    (petUseCases.getAllPetsByClientId as jest.Mock).mockResolvedValue(mockPets);
  });

  it('should load user and pets', async () => {
    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));
    
    await waitFor(() => {
      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.pets).toEqual(mockPets);
    });
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));
    
    await act(async () => {
      await result.current.handleLogout();
    });

    expect(authUseCases.logout).toHaveBeenCalled();
  });

  it('should update user profile', async () => {
    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    act(() => {
        result.current.startEditingProfile();
    });
    
    act(() => {
        result.current.setEditedName('New Name');
    });

    await act(async () => {
        await result.current.handleUpdateProfile();
    });

    expect(authUseCases.updateUser).toHaveBeenCalledWith(expect.objectContaining({
        userName: 'New Name'
    }));
    expect(result.current.currentUser?.userName).toBe('New Name');
  });

  it('should add a new pet', async () => {
    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    act(() => {
        result.current.setNewPetName('Toto');
        result.current.setNewPetBreed('Vira-lata');
    });

    await act(async () => {
        await result.current.handleAddPet();
    });

    expect(petUseCases.createPet).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Toto',
        breed: 'Vira-lata',
        clientId: mockUser.uID
    }));
    
    // Should reload pets
    expect(petUseCases.getAllPetsByClientId).toHaveBeenCalledTimes(2); // Initial load + after add
  });

  it('should validate pet name before adding', async () => {
     // Mock window.alert or rely on behavior. VM uses alert() not Alert.alert for this check?
     // Code says: alert('Por favor, informe o nome do pet.');
     // Jest doesn't mock window.alert by default in RN env usually, but we can spy on global.alert if it exists or check if createPet was NOT called.
     
     const { result } = renderHook(() => useSettingsViewModel(mockNavigation));
     
     act(() => {
         result.current.setNewPetName('');
     });

     await act(async () => {
         await result.current.handleAddPet();
     });

     expect(petUseCases.createPet).not.toHaveBeenCalled();
  });
});
