import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { verifyPasskey } from '@/services/passkeys.service';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

export function useVerifyPasskey(): UseMutationResult<
  ApiResponse<ReadVerifyPasskeyDto>,
  Error,
  {
    verifyWebauthnPasskeyBodyDto: VerifyWebauthnPasskeyBodyDto;
    employeeUuid: string;
  }
> {
  return useMutation({
    mutationFn: ({ verifyWebauthnPasskeyBodyDto, employeeUuid }) =>
      verifyPasskey(verifyWebauthnPasskeyBodyDto, employeeUuid),
    onSuccess: (response) => {
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['getPasskeyPublicByUuid'] });
      }
    },
    onError: (error) => {
      console.log(error);
      console.error('Erro ao verificar Passkey:', error.message);
    },
  });
}
