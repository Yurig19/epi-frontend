import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { updatePpeForm } from '@/services/ppeForm.service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUpdatePpeForm(): UseMutationResult<
  ApiResponse<ReadPpeFormDto>,
  Error,
  { uuid: string; updatePpeFormDto: UpdatePpeFormDto }
> {
  return useMutation({
    mutationFn: ({ uuid, updatePpeFormDto }) =>
      updatePpeForm(uuid, updatePpeFormDto),
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Erro ao atualizar a ficha de EPI', {
          richColors: true,
        });
        throw new Error(response.error);
      }

      if (response.status === 201) {
        queryClient.invalidateQueries({ queryKey: ['ppeForms'] });
        toast.success('Ficha de EPI atualizada com sucesso', {
          richColors: true,
        });
      }
    },
  });
}
