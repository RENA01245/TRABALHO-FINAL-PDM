
import { UpdatePetStatusUseCase } from '../../src/usecase/acompanhamentoPet/UpdatePetStatusUseCase';
import { TrackingUseCases } from '../../src/usecase/acompanhamentoPet/trackingUseCases';
import { PetStatus } from '../../src/model/entities/petAttendance';

describe('Tracking Use Cases', () => {
  const mockRepository = {
    updateStatusByPetMatricula: jest.fn(),
    getTrackingByClientId: jest.fn(),
    createAttendance: jest.fn(),
    getAttendanceByPetId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UpdatePetStatusUseCase', () => {
    it('should update pet status', async () => {
      const useCase = new UpdatePetStatusUseCase(mockRepository);
      await useCase.execute('mat123', 'pronto');
      expect(mockRepository.updateStatusByPetMatricula).toHaveBeenCalledWith('mat123', 'pronto');
    });

    it('should throw error if matricula is missing', async () => {
      const useCase = new UpdatePetStatusUseCase(mockRepository);
      await expect(useCase.execute('', 'pronto')).rejects.toThrow('A matrícula é obrigatória.');
    });
  });

  describe('TrackingUseCases', () => {
    it('should get pet tracking by client id', async () => {
      const useCase = new TrackingUseCases(mockRepository);
      const mockData = [{ id: '1', petName: 'Rex' }];
      mockRepository.getTrackingByClientId.mockResolvedValue(mockData);

      const result = await useCase.getPetTracking('client1');
      expect(result).toEqual(mockData);
      expect(mockRepository.getTrackingByClientId).toHaveBeenCalledWith('client1');
    });
  });
});
