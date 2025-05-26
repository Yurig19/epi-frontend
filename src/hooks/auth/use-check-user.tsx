import { checkToken } from '@/services/auth.service';
import { useQuery } from '@tanstack/react-query';

export function useCheckAuthUser(logout: () => void) {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await checkToken();
        return response.data ?? undefined;
      } catch (error) {
        console.error('User verification error:', error);
        logout();
        return undefined;
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}
