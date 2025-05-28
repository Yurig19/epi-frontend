import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { updateEmployee } from '@/services/employee.service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';

interface UpdateEmployeeParams {
  uuid: string;
  updateEmployeeDto: UpdateEmployeeDto;
}

export function useUpdateEmployee(): UseMutationResult<
  ApiResponse<ReadEmployeesDto>,
  Error,
  UpdateEmployeeParams
> {
  return useMutation({
    mutationFn: ({ uuid, updateEmployeeDto }) =>
      updateEmployee(uuid, updateEmployeeDto),
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
      console.error('Erro ao atualizar funcionário:', error.message);
    },
  });
}
