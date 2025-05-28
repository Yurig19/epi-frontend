type CreateEmployeeDto = {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  position?: string;
  dateOfAdmission?: Date;
  birthDate?: Date;
  departmentUuid?: string;
};

type UpdateEmployeeDto = {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  dateOfAdmission?: Date;
  birthDate?: Date;
  departmentUuid?: string;
};

type SelectEmployeesDto = {
  uuid: string;
  name: string;
};

type ReadEmployeesDto = {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  document: string;
  department: string;
  birthDate: Date;
  departmentUuid: string;
  dateOfAdmission: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type ReadListEmployeesDto = {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  birthDate: Date;
  departmentUuid: string;
  dateOfAdmission: Date;
  document: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type ListEmployeeDto = {
  data: ReadListEmployeesDto[];
  currentPage: number;
  totalPages: number;
  total: number;
};
