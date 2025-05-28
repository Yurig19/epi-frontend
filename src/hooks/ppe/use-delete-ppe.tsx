import { queryClient } from '@/lib/query-client';
import { deletePpe } from '@/services/ppe.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeletePpe() {
  return useMutation({
    mutationFn: deletePpe,
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Erro', {
          description: 'Erro ao excluir EPI',
          richColors: true,
        });
      }
      if (response.data) {
        if (response.data.success) {
          toast.success('Sucesso', {
            description: 'EPI excluído com sucesso',
            richColors: true,
          });
          queryClient.invalidateQueries({ queryKey: ['ppe'] });
          queryClient.invalidateQueries({ queryKey: ['selectPpe'] });
        } else {
          toast.error('Erro', {
            description: 'Erro ao excluir EPI',
            richColors: true,
          });
          throw new Error(response.data.message || 'Erro ao excluir EPI');
        }
      }
    },
    onError: (error) => {
      console.error('Error deleting PPE:', error);
      toast.error('Erro', {
        description: 'Erro ao excluir EPI',
        richColors: true,
      });
    },
  });
}
