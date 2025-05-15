import api from '@/client/api';

export async function listAudits(
  page: number,
  dataPerPage: number,
  search?: string
) {
  return await api.get<ListAuditsDto>(
    `/audits/list?page=${page}&dataPerPage=${dataPerPage}&search=${search}`
  );
}
