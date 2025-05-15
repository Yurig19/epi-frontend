import { deleteEmployee } from '@/services/employee.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
