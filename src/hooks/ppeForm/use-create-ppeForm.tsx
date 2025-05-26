import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { createPpeForm } from '@/services/ppeForm.service';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreatePpeForm(): UseMutationResult<
  ApiResponse<ReadPpeFormDto>,
  Error,
  CreatePpeFormDto
> {
  return useMutation({
    mutationFn: createPpeForm,
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Erro ao Cadastrar a ficha de EPI', {
          richColors: true,
        });
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['ppeForms'] });
        toast.success('Sucesso!', {
          description: 'Ficha de EPI cadastrada com sucesso!',
          richColors: true,
        });
      }
    },
  });
}
