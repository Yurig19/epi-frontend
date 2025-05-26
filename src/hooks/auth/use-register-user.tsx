import { queryClient } from '@/lib/query-client';
import { register } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';

import { setCookie } from 'nookies';

export function useRegisterRequest() {
  return useMutation({
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
}
