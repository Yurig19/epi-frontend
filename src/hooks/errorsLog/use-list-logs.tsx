import { listLogs } from '@/services/logs.service';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useListErrorsLogs(
  page: number,
  itensPerPage: number,
  search: string,
  startDate?: Date,
  endDate?: Date
) {
  return useQuery({
    queryKey: ['logs', page, itensPerPage, search, startDate, endDate],
    queryFn: async () => {
      const response = await listLogs(
        page,
        itensPerPage,
        search
        // startDate,
        // endDate
      );

      if (!response.data) {
        console.error('Erro ao buscar os logs:', response.error);
        toast.error('Erro ao buscar os logs', {
          duration: 3000,
          description: 'Tente novamente mais tarde.',
          richColors: true,
        });
      }
      return response.data;
    },
  });
}
