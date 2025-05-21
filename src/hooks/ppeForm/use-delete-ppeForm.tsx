import { queryClient } from '@/lib/query-client';
import { deletePpeForm } from '@/services/ppeForm.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeletePpeForms() {
  return useMutation({
    mutationFn: deletePpeForm,
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error);
      }
      queryClient.invalidateQueries({ queryKey: ['ppeForms'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao excluir ficha de EPI', {
        description: error.message,
      });
    },
  });
}
