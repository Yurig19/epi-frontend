import { queryClient } from '@/lib/query-client';
import { deleteDepartment } from '@/services/departments.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteDepartments() {
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Erro', {
          description: 'Erro ao excluir o departamento',
          richColors: true,
        });
      }
      if (response.data) {
        if (response.data.success) {
          toast.success('Sucesso', {
            description: 'O departamento excluído com sucesso',
            richColors: true,
          });
          queryClient.invalidateQueries({ queryKey: ['departments'] });
          queryClient.invalidateQueries({ queryKey: ['selectDepartments'] });
        } else {
          toast.error('Erro', {
            description: 'Erro ao excluir o departamento',
            richColors: true,
          });
          throw new Error(
            response.data.message || 'Erro ao excluir o departamento'
          );
        }
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro!', {
        description: 'Erro ao deletar o departamento',
        richColors: true,
      });
    },
  });
}
