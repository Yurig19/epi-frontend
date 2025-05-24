import { getByUuidPublic } from '@/services/ppeForm.service';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

export function useGetByUuidPpeFormPublic(
  uuid: string,
  options?: UseQueryOptions<ReadPpeFormPublicDto, Error>
): UseQueryResult<ReadPpeFormPublicDto, Error> {
  return useQuery<ReadPpeFormPublicDto, Error>({
    queryKey: ['ppeFormPublic', uuid],
    queryFn: async () => {
      const response = await getByUuidPublic(uuid);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    enabled: !!uuid,
    ...options,
  });
}
