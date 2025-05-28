import { queryClient } from '@/lib/query-client';
import { deletePpeForm } from '@/services/ppeForm.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeletePpeForms() {
  return useMutation({
    mutationFn: deletePpeForm,
    onSuccess: async (response) => {
      if (response.error) {
        toast.error('Erro', {
          description: 'Erro ao excluir a ficha de EPI',
          richColors: true,
        });
      }
      if (response.data) {
        if (response.data.success) {
          await queryClient.refetchQueries({
            queryKey: ['ppeForms'],
            exact: false,
          });
          toast.success('Sucesso', {
            richColors: true,
            description: 'Ficha de EPI excluída com sucesso!',
          });
        } else {
          toast.error('Erro!', {
            richColors: true,
            description: 'Erro ao excluir a ficha de EPI',
          });
          throw new Error(
            response.data.message || 'Erro ao excluir a ficha de EPI'
          );
        }
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao excluir ficha de EPI', {
        description: error.message,
      });
    },
  });
}
