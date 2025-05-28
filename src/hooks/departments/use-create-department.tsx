import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { createDepartment } from '@/services/departments.service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';

export function useCreateDepartment(): UseMutationResult<
  ApiResponse<ReadDepartmentsDto>,
  Error,
  CreateDepartmentDto
> {
  return useMutation({
    mutationFn: createDepartment,
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
      console.error('Erro ao criar Departamentos:', error.message);
    },
  });
}
