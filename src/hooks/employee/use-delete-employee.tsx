import { queryClient } from '@/lib/query-client';
import { deleteEmployee } from '@/services/employee.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteEmployee() {
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Erro ao excluir funcionário', {
          richColors: true,
        });
        throw new Error(response.error);
      }

      if (response.data) {
        if (response.data.success) {
          toast.success('Funcionário excluído com sucesso', {
            richColors: true,
          });
          queryClient.invalidateQueries({ queryKey: ['employees'] });
          queryClient.invalidateQueries({ queryKey: ['selectEmployees'] });
        } else {
          toast.error('Erro ao excluir funcionário', {
            richColors: true,
          });
          throw new Error();
        }
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error('Erro!', {
        description: 'Erro ao excluir funcionário',
        richColors: true,
      });
    },
  });
}
