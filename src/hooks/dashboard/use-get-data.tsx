import { fetchDashboardData } from '@/services/dashboard.service';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export function useGetDashboardData(): UseQueryResult<
  ReadDashboardData,
  Error
> {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await fetchDashboardData();

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });
}
