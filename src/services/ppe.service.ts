import api from '@/client/api';

export async function createPpe(data: CreatePpeDto) {
  return await api.post<ReadPpeDto>('/ppe/create', data);
}

export async function updatePpe(uuid: string, data: UpdatePpeDto) {
  return await api.put<ReadPpeDto>(`/ppe/update/?uuid=${uuid}`, data);
}

export async function selectPpe(search?: string) {
  return await api.get<SelectPpeDto[]>(`/ppe/select?search=${search}`);
}

export async function getListPpe(
  page: number,
  dataPerPage: number,
  search?: string,
  status?: string,
  startDate?: Date | undefined,
  endDate?: Date | undefined
) {
  return await api.get<ListPpeDto>(
    `/ppe/list?page=${page}&dataPerPage=${dataPerPage}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`
  );
}

export async function deletePpe(uuid: string) {
  return await api.delete<DeleteDto>(`/ppe/delete/?uuid=${uuid}`);
}
