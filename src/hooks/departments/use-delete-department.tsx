import { deleteDepartment } from '@/services/departments.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
