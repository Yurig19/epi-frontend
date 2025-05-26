import { useQuery } from '@tanstack/react-query';
import { getListPpeForm } from '@/services/ppeForm.service';
import { toast } from 'sonner';

export function useListPpeForms(
  page: number,
  itemsPerPage: number,
  search?: string,
  status?: string,
  startDate?: Date,
  endDate?: Date
) {
  return useQuery({
    queryKey: [
      'ppeForms',
      page,
      status,
      itemsPerPage,
      search,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      console.log('Fetching PPE forms list');
      const response = await getListPpeForm(
        page,
        itemsPerPage,
        search,
        status === 'all' ? '' : status,
        startDate,
        endDate
      );

      if (!response.data) {
        toast.error('Erro ao buscar as Fichas de EPI', {
          duration: 3000,
          description: 'Tente novamente mais tarde.',
          richColors: true,
        });
      }

      return response.data;
    },
  });
}
