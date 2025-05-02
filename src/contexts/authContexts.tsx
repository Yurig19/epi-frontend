import { checkToken, login, register } from '@/services/auth.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { destroyCookie, setCookie } from 'nookies';
import { type ReactNode, createContext, useContext } from 'react';

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
  const queryClient = useQueryClient();

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await checkToken();
        return response.data ?? undefined;
      } catch (error) {
        console.error('Erro na verificação do usuário:', error);
        logout();
        return undefined;
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (response.data.user) {
        queryClient.setQueryData(['authUser'], response.data.user);
      }
      if (response.data.accessToken) {
        setCookie(null, 'token', response.data.accessToken, {
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
          secure: true,
        });
      }
    },
    onError: (error) => {
      console.error('Erro ao fazer login:', error);
      destroyCookie(null, 'token', { path: '/' });
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      if (response.data.user) {
        queryClient.setQueryData(['authUser'], response.data.user);
      }
      if (response.data.accessToken) {
        setCookie(null, 'token', response.data.accessToken, {
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
          secure: true,
        });
      }
    },
  });

  const handleLogin = async (authLoginDto: AuthLoginDto): Promise<void> => {
    await loginMutation.mutateAsync(authLoginDto);
  };

  const handleRegister = async (
    registerAuthDto: RegisterAuthDto
  ): Promise<void> => {
    await registerMutation.mutateAsync(registerAuthDto);
  };

  const logout = (): void => {
    queryClient.removeQueries({ queryKey: ['authUser'] });
    destroyCookie(null, 'token', { path: '/' });
    window.location.href = '/';
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
