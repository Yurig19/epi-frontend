import api from '@/client/api';

export function createEmployee(createEmployeeDto: CreateEmployeeDto) {
  return api.post<ReadEmployeesDto>('/employees/create', createEmployeeDto);
}

export async function listEmployees(
  page: number,
  dataPerPage: number,
  search?: string,
  startDate?: Date | undefined,
  endDate?: Date | undefined
) {
  return await api.get<ListEmployeeDto>(
    `/employees/list?page=${page}&dataPerPage=${dataPerPage}&search=${search}&startDate=${startDate}&endDate=${endDate}`
  );
}

export function selectEmployees(search?: string) {
  return api.get<SelectEmployeesDto[]>(`/employees/select?search=${search}`);
}

export function updateEmployee(
  uuid: string,
  updateEmployeeDto: UpdateEmployeeDto
) {
  return api.put<ReadEmployeesDto>(
    `/employees/update?uuid=${uuid}`,
    updateEmployeeDto
  );
}

export function deleteEmployee(uuid: string) {
  return api.delete(`/employees/delete?uuid=${uuid}`);
}
