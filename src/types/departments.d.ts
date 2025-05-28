type CreateDepartmentDto = {
  name: string;
  status?: DepartmentsStatusEnum;
};

type ReadDepartmentsDto = {
  uuid: string;
  name: string;
  status: DepartmentsStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type SelectDepartmentsDto = {
  uuid: string;
  name: string;
};

type ReadListDepartmentsDto = {
  uuid: string;
  name: string;
  status: DepartmentsStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type ListDepartmentsDto = {
  data: ReadListDepartmentsDto[];
  currentPage: number;
  totalPages: number;
  total: number;
};

type UpdateDepartmentDto = {
  name?: string;
  status?: DepartmentsStatusEnum;
};
