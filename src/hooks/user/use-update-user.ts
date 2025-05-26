import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { updateUser } from '@/services/user.service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUpdateUser(): UseMutationResult<
  ApiResponse<ReadUserDto>,
  Error,
  UpdateUserDto
> {
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Erro ao atualizar a usuário', {
          richColors: true,
        });
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast.success('usuário atualizada com sucesso', {
          richColors: true,
        });
      }
    },
  });
}
