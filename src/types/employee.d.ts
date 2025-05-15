type CreateEmployeeDto = {
  name: string;
  email: string;
  phone: string;
  position?: string;
};

type UpdateEmployeeDto = {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
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
