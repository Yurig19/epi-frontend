import { destroyCookie } from 'nookies';
import { type ReactNode, createContext, useContext } from 'react';
import { useCheckAuthUser } from '@/hooks/auth/use-check-user';
import { useLoginRequest } from '@/hooks/auth/use-login-user';
import { useRegisterRequest } from '@/hooks/auth/use-register-user';
import { queryClient } from '@/lib/query-client';

interface AuthContextType {
  user: ReadUserAuthDto | undefined;
  loading: boolean;
  handleLogin: (authLoginDto: AuthLoginDto) => Promise<void>;
  handleRegister: (registerAuthDto: RegisterAuthDto) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const logout = (): void => {
    queryClient.removeQueries({ queryKey: ['authUser'] });
    destroyCookie(null, 'token', { path: '/' });
    window.location.href = '/';
  };

  const { data: user, isLoading: loading } = useCheckAuthUser(logout);
  const loginMutation = useLoginRequest();
  const registerMutation = useRegisterRequest();

  const handleLogin = async (authLoginDto: AuthLoginDto): Promise<void> => {
    await loginMutation.mutateAsync(authLoginDto);
  };

  const handleRegister = async (
    registerAuthDto: RegisterAuthDto
  ): Promise<void> => {
    await registerMutation.mutateAsync(registerAuthDto);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogin, handleRegister, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
