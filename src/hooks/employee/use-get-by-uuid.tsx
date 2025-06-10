import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getByUuid } from '@/services/employee.service';
import { queryClient } from '@/lib/query-client';
import { toast } from 'sonner';

export function useGetByUuidEmployee(
  uuid: string
): UseQueryResult<ReadEmployeesDto, Error> {
  return useQuery({
    queryKey: ['employee', uuid],
    queryFn: async () => {
      const response = await getByUuid(uuid);

      if (response.error) {
        toast.error('Funcionário não encontrado.', {
          description: 'Verifique se o funcionário está correto.',
          richColors: true,
        });
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['employee'] });
      }

      return response.data;
    },

    enabled: !!uuid,
  });
}
