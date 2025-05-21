import { useQuery } from '@tanstack/react-query';
import { getListPpe } from '@/services/ppe.service';
import { toast } from 'sonner';

export function useListPpe(
  page: number,
  itemsPerPage: number,
  search: string,
  status?: string,
  startDate?: Date,
  endDate?: Date
) {
  return useQuery({
    queryKey: ['ppe', page, itemsPerPage, search, status, startDate, endDate],
    queryFn: async () => {
      const response = await getListPpe(
        page,
        itemsPerPage,
        search,
        status,
        startDate,
        endDate
      );

      if (!response.data) {
        console.error('Erro ao buscar os epis:', response.error);
        toast.error('Erro ao buscar os EPI', {
          duration: 3000,
          description: 'Tente novamente mais tarde.',
          richColors: true,
        });
      }

      return response.data;
    },
  });
}
