import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { updateDepartment } from '@/services/departments.service';
// biome-ignore lint/style/useImportType: <explanation>
import { UseMutationResult, useMutation } from '@tanstack/react-query';

interface UpdateDepartmentParams {
  uuid: string;
  updateDepartmentDto: UpdateDepartmentDto;
}

export function useUpdateDepartment(): UseMutationResult<
  ApiResponse<ReadDepartmentsDto>,
  Error,
  UpdateDepartmentParams
> {
  return useMutation({
    mutationFn: ({ uuid, updateDepartmentDto }) =>
      updateDepartment(uuid, updateDepartmentDto),
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        queryClient.invalidateQueries({ queryKey: ['selectDepartments'] });
      }
    },
    onError: (error) => {
      console.error('Erro ao atualizar funcionário:', error.message);
    },
  });
}
