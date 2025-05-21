import { useQuery } from '@tanstack/react-query';
import { selectEmployees } from '@/services/employee.service';

export function useSelectEmployees(search?: string) {
  return useQuery({
    queryKey: ['selectEmployees', search],
    queryFn: async () => {
      const response = await selectEmployees(search ?? '');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
