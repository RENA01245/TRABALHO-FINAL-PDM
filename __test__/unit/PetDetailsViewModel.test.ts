
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePetDetailsViewModel } from '../../src/viewmodel/PetDetailsViewModel';
import { petUseCases } from '../../src/di/container';
import { storageService } from '../../src/infra/services/supabase/supabaseStorageService';
import { Alert } from 'react-native';

jest.mock('../../src/di/container', () => ({
  petUseCases: {
    updatePet: jest.fn(),
    deletePet: jest.fn(),
  },
}));

jest.mock('../../src/infra/services/supabase/supabaseStorageService', () => ({
  storageService: {
    uploadImage: jest.fn(),
    deleteImage: jest.fn().mockResolvedValue(true),
    extractPathFromUrl: jest.fn().mockReturnValue('path/to/image.jpg'),
  },
}));

jest.spyOn(Alert, 'alert');

describe('usePetDetailsViewModel', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockPet = { id: 'p1', name: 'Rex', clientId: 'user123', imageUrl: 'http://test.com/img.jpg' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with pet data', () => {
    const { result } = renderHook(() => usePetDetailsViewModel(mockNavigation, mockPet));
    expect(result.current.pet).toEqual(mockPet);
    expect(result.current.editName).toBe(mockPet.name);
  });

  it('should update pet details', async () => {
    const { result } = renderHook(() => usePetDetailsViewModel(mockNavigation, mockPet));

    act(() => {
      result.current.setEditName('Rex Updated');
    });

    await act(async () => {
      await result.current.handleUpdatePet();
    });

    expect(petUseCases.updatePet).toHaveBeenCalledWith(expect.objectContaining({
      id: mockPet.id,
      name: 'Rex Updated',
    }));
    expect(result.current.pet.name).toBe('Rex Updated');
    expect(result.current.isEditModalVisible).toBe(false);
  });

  it('should handle pet deletion', async () => {
    const { result } = renderHook(() => usePetDetailsViewModel(mockNavigation, mockPet));

    act(() => {
      result.current.handleDeletePet();
    });

    // Simulate confirming deletion via Alert
    const alertCalls = (Alert.alert as jest.Mock).mock.calls;
    const deleteButton = alertCalls[0][2][1]; // 2nd button is Delete

    await act(async () => {
      await deleteButton.onPress();
    });

    expect(storageService.deleteImage).toHaveBeenCalled();
    expect(petUseCases.deletePet).toHaveBeenCalledWith(mockPet.id);
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
