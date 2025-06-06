import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { createPpe } from '@/services/ppe.service';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

export function useCreatePpe(): UseMutationResult<
  ApiResponse<ReadPpeDto>,
  Error,
  CreatePpeDto
> {
  return useMutation({
    mutationFn: createPpe,
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['ppe'] });
        queryClient.invalidateQueries({ queryKey: ['selectPpe'] });
      }
    },
    onError: (error) => {
      console.log(error);
      console.error('Erro ao criar PPE:', error.message);
    },
  });
}
