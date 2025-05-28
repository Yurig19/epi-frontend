import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { updatePpe } from '@/services/ppe.service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';

interface UpdatePpeParams {
  uuid: string;
  updatePpeDto: UpdatePpeDto;
}

export function useUpdatePpe(): UseMutationResult<
  ApiResponse<ReadPpeDto>,
  Error,
  UpdatePpeParams
> {
  return useMutation({
    mutationFn: ({ uuid, updatePpeDto }) => updatePpe(uuid, updatePpeDto),
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
      console.error('Erro ao atualizar EPI:', error.message);
    },
  });
}
