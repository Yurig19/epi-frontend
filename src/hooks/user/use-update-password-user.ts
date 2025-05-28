import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { updatePassword } from '@/services/user.service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUpdatePasswordUser(): UseMutationResult<
  ApiResponse<ReadUpdatePasswordDto>,
  Error,
  UpdatePasswordDto
> {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Erro ao atualizar a senha do usuário', {
          richColors: true,
        });
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast.success('Sucesso!', {
          description: 'A senha do usuário atualizada com sucesso!',
          richColors: true,
        });
      }
    },
  });
}
