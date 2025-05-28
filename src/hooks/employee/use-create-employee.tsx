import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { createEmployee } from '@/services/employee.service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';

export function useCreateEmployee(): UseMutationResult<
  ApiResponse<ReadEmployeesDto>,
  Error,
  CreateEmployeeDto
> {
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        queryClient.invalidateQueries({ queryKey: ['selectEmployees'] });
      }
    },
    onError: (error) => {
      console.log(error);
      console.error('Erro ao criar funcionário:', error.message);
    },
  });
}
