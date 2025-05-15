import { useQuery } from '@tanstack/react-query';
import { selectPpe } from '@/services/ppe.service';

export function useSelectPpe(search: string) {
  return useQuery({
    queryKey: ['selectPpe', search],
    queryFn: async () => {
      const response = await selectPpe(search);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
