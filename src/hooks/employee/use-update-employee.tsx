import type { ApiResponse } from '@/client/api.client';
import { updateEmployee } from '@/services/employee.service';
// biome-ignore lint/style/useImportType: <explanation>
import {
  UseMutationResult,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';

interface UpdateEmployeeParams {
  uuid: string;
  updateEmployeeDto: UpdateEmployeeDto;
}

export function useUpdateEmployee(): UseMutationResult<
  ApiResponse<ReadEmployeesDto>,
  Error,
  UpdateEmployeeParams
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, updateEmployeeDto }) =>
      updateEmployee(uuid, updateEmployeeDto),
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['employees'] });
      }
    },
    onError: (error) => {
      console.log(error);
      console.error('Erro ao atualizar funcionário:', error.message);
    },
  });
}
