import api from '@/client/api';

export async function listLogs(
  page: number,
  dataPerPage: number,
  search?: string
) {
  return await api.get<ListLogsDto>(
    `/audits/list?page=${page}&dataPerPage=${dataPerPage}&search=${search}`
  );
}
