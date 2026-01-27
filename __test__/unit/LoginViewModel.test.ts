
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useLoginViewModel } from '../../src/viewmodel/LoginViewModel';
import { authUseCases } from '../../src/di/container';

jest.mock('../../src/di/container', () => ({
  authUseCases: {
    login: jest.fn(),
    loginWithGoogle: jest.fn(),
  },
}));

describe('useLoginViewModel', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update email and password', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password123');
    });

    expect(result.current.email).toBe('test@example.com');
    expect(result.current.password).toBe('password123');
  });

  it('should show error if fields are empty on login', async () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe('Por favor, preencha todos os campos.');
    expect(authUseCases.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on success', async () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password123');
    });

    (authUseCases.login as jest.Mock).mockResolvedValueOnce({});

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(authUseCases.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('MainTabs');
    expect(result.current.loading).toBe(false);
  });

  it('should handle login error', async () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('wrongpass');
    });

    const errorMsg = 'Credenciais inválidas';
    (authUseCases.login as jest.Mock).mockRejectedValueOnce(new Error(errorMsg));

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe(errorMsg);
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should navigate to SignUp', () => {
    const { result } = renderHook(() => useLoginViewModel(mockNavigation));

    act(() => {
      result.current.handleSignUp();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUp');
  });
});
