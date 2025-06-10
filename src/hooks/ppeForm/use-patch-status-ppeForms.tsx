import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { patchPpeForm } from '@/services/ppeForm.service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function usePatchStatusPpeForms(): UseMutationResult<
  ApiResponse<ReadPpeFormDto>,
  Error,
  { uuid: string; patchPpeFormsStatusDto: PatchPpeFormStatusDto }
> {
  return useMutation({
    mutationFn: ({ uuid, patchPpeFormsStatusDto }) =>
      patchPpeForm(uuid, patchPpeFormsStatusDto),
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Erro!', {
          description: 'Erro ao atualizar o status da ficha de EPI',
          richColors: true,
        });
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['ppeForms'] });
      }
    },
  });
}
