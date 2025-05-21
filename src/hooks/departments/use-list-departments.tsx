import { listDepartments } from '@/services/departments.service';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useListDepartments(
  page: number,
  itensPerPage: number,
  search: string,
  startDate?: Date,
  endDate?: Date
) {
  return useQuery({
    queryKey: ['departments', page, itensPerPage, search, startDate, endDate],
    queryFn: async () => {
      const response = await listDepartments(
        page,
        itensPerPage,
        search ?? '',
        startDate,
        endDate
      );

      if (!response.data) {
        console.error('Erro ao buscar os Departamentos:', response.error);
        toast.error('Erro ao buscar os Departamentos', {
          duration: 3000,
          description: 'Tente novamente mais tarde.',
          richColors: true,
        });
      }
      return response.data;
    },
  });
}
