import { queryClient } from '@/lib/query-client';
import { deletePpe } from '@/services/ppe.service';
import { useMutation } from '@tanstack/react-query';

export function useDeletePpe() {
  return useMutation({
    mutationFn: deletePpe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppe'] });
    },
    onError: (error) => {
      console.error('Error deleting PPE:', error);
    },
  });
}
