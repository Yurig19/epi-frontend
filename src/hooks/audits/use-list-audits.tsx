import { listAudits } from '@/services/audits.service';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useListAudits(
  page: number,
  itensPerPage: number,
  search: string,
  startDate?: Date,
  endDate?: Date
) {
  return useQuery({
    queryKey: ['audits', page, itensPerPage, search, startDate, endDate],
    queryFn: async () => {
      const response = await listAudits(
        page,
        itensPerPage,
        search
        // startDate,
        // endDate
      );

      if (!response.data) {
        console.error('Erro ao buscar as auditorias:', response.error);
        toast.error('Erro ao buscar as auditorias', {
          duration: 3000,
          description: 'Tente novamente mais tarde.',
          richColors: true,
        });
      }
      return response.data;
    },
  });
}
