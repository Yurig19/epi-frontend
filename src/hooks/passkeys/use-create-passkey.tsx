import type { ApiResponse } from '@/client/api.client';
import { queryClient } from '@/lib/query-client';
import { createPasskey } from '@/services/passkeys.service';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

export function useCreatePasskey(): UseMutationResult<
  ApiResponse<ReadPasskeyDto>,
  Error,
  {
    createWebauthnPasskeyBodyDto: CreateWebauthnPasskeyBodyDto;
    employeeUuid: string;
    challenge?: string;
  }
> {
  return useMutation({
    mutationFn: ({ createWebauthnPasskeyBodyDto, employeeUuid, challenge }) =>
      createPasskey(createWebauthnPasskeyBodyDto, employeeUuid, challenge),
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
      console.error('Erro ao criar Passkey:', error.message);
    },
  });
}
