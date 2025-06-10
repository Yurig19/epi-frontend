import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePasskey } from '@/services/passkeys.service';

// Definindo DeleteDto localmente pois o arquivo de tipos não é um módulo
type DeleteDto = {
  success: boolean;
  statusCode: number;
  message: string;
};

export function useDeletePasskey() {
  const queryClient = useQueryClient();

  return useMutation<DeleteDto, Error, string>({
    mutationFn: async (uuid: string) => {
      const response = await deletePasskey(uuid);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPasskeyPublicByUuid'] });
    },
  });
}
