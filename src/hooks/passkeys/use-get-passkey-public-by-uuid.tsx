import { getByEmployeeUuid } from '@/services/passkeys.service';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

export function useGetByUuidPasskeyPublic(
  employeeUuid: string,
  options?: UseQueryOptions<ReadPasskeyDto[], Error>
): UseQueryResult<ReadPasskeyDto[], Error> {
  return useQuery<ReadPasskeyDto[], Error>({
    queryKey: ['getPasskeyPublicByUuid', employeeUuid],
    queryFn: async () => {
      const response = await getByEmployeeUuid(employeeUuid);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    enabled: !!employeeUuid,
    ...options,
  });
}
