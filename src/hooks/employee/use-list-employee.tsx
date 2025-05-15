import { listEmployees } from '@/services/employee.service';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useListEmployee(
  page: number,
  itensPerPage: number,
  search: string,
  startDate?: Date,
  endDate?: Date
) {
  return useQuery({
    queryKey: ['employees', page, itensPerPage, search, startDate, endDate],
    queryFn: async () => {
      const response = await listEmployees(
        page,
        itensPerPage,
        search,
        startDate,
        endDate
      );

      if (!response.data) {
        console.error('Erro ao buscar os Funcionários:', response.error);
        toast.error('Erro ao buscar os Funcionários', {
          duration: 3000,
          description: 'Tente novamente mais tarde.',
          richColors: true,
        });
      }
      return response.data;
    },
  });
}
