import api from '@/client/api';

export async function createPpeForm(createPpeFormDto: CreatePpeFormDto) {
  return await api.post<ReadPpeFormDto>('/pPEForms/create', createPpeFormDto);
}

export function getByUuid(uuid: string) {
  return api.get<ReadPpeFormDto>(`/pPEForms/get-by-uuid?uuid=${uuid}`);
}

export async function getByUuidPublic(uuid: string) {
  return await api.get<ReadPpeFormPublicDto>(
    `/pPEForms/public-get-by-uuid?uuid=${uuid}`
  );
}

export async function updatePpeForm(
  uuid: string,
  updatePpeFormDto: UpdatePpeFormDto
) {
  return await api.put<ReadPpeFormDto>(
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
    `/pPEForms/list?page=${page}&dataPerPage=${dataPerPage}&search=${search}&status=${status ?? ''}&startDate=${startDate}&endDate=${endDate}`
  );
}

export async function deletePpeForm(uuid: string) {
  return await api.delete<DeleteDto>(`/pPEForms/delete?uuid=${uuid}`);
}
