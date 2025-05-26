import { queryClient } from '@/lib/query-client';
import { login } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { setCookie, destroyCookie } from 'nookies';

export function useLoginRequest() {
  return useMutation({
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
      console.error('Login error:', error);
      destroyCookie(null, 'token', { path: '/' });
    },
  });
}
