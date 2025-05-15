import api from '@/client/api';

export async function selectPpe(search: string) {
  return await api.get<SelectPpeDto[]>(`/ppe/select?search=${search}`);
}

export async function getListPpe(
  page: number,
  dataPerPage: number,
  search?: string,
  startDate?: Date | undefined,
  endDate?: Date | undefined
) {
  return await api.get<ListPpeDto>(
    `/ppe/list?page=${page}&dataPerPage=${dataPerPage}&search=${search}&startDate=${startDate}&endDate=${endDate}`
  );
}
