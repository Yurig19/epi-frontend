import { queryClient } from '@/lib/query-client';
import { getByUuid } from '@/services/ppeForm.service';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

export function useGetByUuidPpeForm(
  uuid: string,
  options?: UseQueryOptions<ReadPpeFormDto, Error>
): UseQueryResult<ReadPpeFormDto, Error> {
  return useQuery<ReadPpeFormDto, Error>({
    queryKey: ['ppeForm', uuid],
    queryFn: async () => {
      const response = await getByUuid(uuid);

      if (response.error) {
        throw new Error(response.error);
      }

      queryClient.invalidateQueries({ queryKey: ['ppeForms'] });

      return response.data;
    },
    enabled: !!uuid,
    ...options,
  });
}
