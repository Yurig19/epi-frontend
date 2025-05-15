import type { ApiResponse } from '@/client/api.client';
import { createEmployee } from '@/services/employee.service';
// biome-ignore lint/style/useImportType: <explanation>
import {
  UseMutationResult,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';

export function useCreateEmployee(): UseMutationResult<
  ApiResponse<ReadEmployeesDto>,
  Error,
  CreateEmployeeDto
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.status === 201) {
        queryClient.invalidateQueries({ queryKey: ['employees'] });
      }
    },
    onError: (error) => {
      console.log(error);
      console.error('Erro ao criar funcionário:', error.message);
    },
  });
}
