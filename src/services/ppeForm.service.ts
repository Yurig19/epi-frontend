import api from '@/client/api';

// export function createPpeForm(createPpeFormDto: CreatePpeFormDto) {
//   return api.post<ReadPpeFormDto>('/ppeForm/create', createPpeFormDto);
// }

export async function getListPpeForm(
  page: number,
  dataPerPage: number,
  search?: string,
  status?: string,
  startDate?: Date | undefined,
  endDate?: Date | undefined
) {
  return await api.get<ListPpeFormDto>(
    `/ppeForm/list?page=${page}&dataPerPage=${dataPerPage}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`
  );
}
