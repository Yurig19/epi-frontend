import { useQuery } from '@tanstack/react-query';
import { selectDepartments } from '@/services/departments.service';

export function useSelectDepartments() {
  return useQuery({
    queryKey: ['selectDepartments'],
    queryFn: async () => {
      const response = await selectDepartments();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
