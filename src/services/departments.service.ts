import api from '@/client/api';

export function createDepartment(createDepartmentDto: CreateDepartmentDto) {
  return api.post<ReadDepartmentsDto>(
    '/departments/create',
    createDepartmentDto
  );
}

export function updateDepartment(
  uuid: string,
  updateDepartmentDto: UpdateDepartmentDto
) {
  return api.put<ReadDepartmentsDto>(
    `/departments/update?uuid=${uuid}`,
    updateDepartmentDto
  );
}

export function deleteDepartment(uuid: string) {
  return api.delete<boolean>(`/departments/delete?uuid=${uuid}`);
}

export function getDepartmentByUuid(uuid: string) {
  return api.get<ReadDepartmentsDto>(`/departments/get-by-uuid?uuid=${uuid}`);
}

export function selectDepartments() {
  return api.get<SelectDepartmentsDto[]>('/departments/select');
}

export async function listDepartments(
  page: number,
  dataPerPage: number,
  search?: string,
  startDate?: Date,
  endDate?: Date
) {
  const params = new URLSearchParams({
    page: page.toString(),
    dataPerPage: dataPerPage.toString(),
  });

  if (search) params.append('search', search);
  if (startDate) params.append('startDate', startDate.toISOString());
  if (endDate) params.append('endDate', endDate.toISOString());

  return await api.get<ListDepartmentsDto>(
    `/departments/list?${params.toString()}`
  );
}
