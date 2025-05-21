import api from '@/client/api';

export function createPpeForm(createPpeFormDto: CreatePpeFormDto) {
  return api.post<ReadPpeFormDto>('/pPEForms/create', createPpeFormDto);
}

export function getByUuid(uuid: string) {
  return api.get<ReadPpeFormDto>(`/pPEForms/get-by-uuid?uuid=${uuid}`);
}

export function updatePpeForm(
  uuid: string,
  updatePpeFormDto: UpdatePpeFormDto
) {
  return api.put<ReadPpeFormDto>(
    `/pPEForms/update?uuid=${uuid}`,
    updatePpeFormDto
  );
}

export async function getListPpeForm(
  page: number,
  dataPerPage: number,
  search?: string,
  status?: string,
  startDate?: Date | undefined,
  endDate?: Date | undefined
) {
  return await api.get<ListPpeFormDto>(
    `/pPEForms/list?page=${page}&dataPerPage=${dataPerPage}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`
  );
}

export function deletePpeForm(uuid: string) {
  return api.delete(`/pPEForms/delete?uuid=${uuid}`);
}
