
import { renderHook, act } from '@testing-library/react-native';
import { useSignUpViewModel } from '../../src/viewmodel/SignUpViewModel';
import { authUseCases } from '../../src/di/container';

// Mocks
jest.mock('../../src/di/container', () => ({
  authUseCases: {
    signUp: jest.fn(),
    loginWithGoogle: jest.fn(),
  },
}));

describe('useSignUpViewModel', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSignUpViewModel(mockNavigation));
    expect(result.current.name).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.confirmPassword).toBe('');
  });

  it('should show error if fields are empty', async () => {
    const { result } = renderHook(() => useSignUpViewModel(mockNavigation));

    await act(async () => {
      await result.current.handleSignUp();
    });

    expect(result.current.error).toBe('Por favor, preencha todos os campos.');
  });

  it('should show error if passwords do not match', async () => {
    const { result } = renderHook(() => useSignUpViewModel(mockNavigation));

    act(() => {
      result.current.setName('User');
      result.current.setEmail('test@test.com');
      result.current.setPassword('123456');
      result.current.setConfirmPassword('654321');
    });

    await act(async () => {
      await result.current.handleSignUp();
    });

    expect(result.current.error).toBe('As senhas não coincidem.');
  });

  it('should show error if password is too short', async () => {
    const { result } = renderHook(() => useSignUpViewModel(mockNavigation));

    act(() => {
      result.current.setName('User');
      result.current.setEmail('test@test.com');
      result.current.setPassword('123');
      result.current.setConfirmPassword('123');
    });

    await act(async () => {
      await result.current.handleSignUp();
    });

    expect(result.current.error).toBe('A senha deve ter pelo menos 6 caracteres.');
  });

  it('should sign up successfully', async () => {
    const { result } = renderHook(() => useSignUpViewModel(mockNavigation));

    act(() => {
      result.current.setName('User');
      result.current.setEmail('test@test.com');
      result.current.setPassword('123456');
      result.current.setConfirmPassword('123456');
    });

    (authUseCases.signUp as jest.Mock).mockResolvedValue({});

    await act(async () => {
      await result.current.handleSignUp();
    });

    expect(authUseCases.signUp).toHaveBeenCalledWith('User', 'test@test.com', '123456');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('MainTabs');
  });

  it('should handle signup error', async () => {
    const { result } = renderHook(() => useSignUpViewModel(mockNavigation));

    act(() => {
      result.current.setName('User');
      result.current.setEmail('test@test.com');
      result.current.setPassword('123456');
      result.current.setConfirmPassword('123456');
    });

    (authUseCases.signUp as jest.Mock).mockRejectedValue(new Error('Signup failed'));

    await act(async () => {
      await result.current.handleSignUp();
    });

    expect(result.current.error).toBe('Signup failed');
  });
});
