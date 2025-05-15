type ReadListPpeFormDto = {
  uuid: string;
  name: string;
  status: string;
  signature: string;
  employeeUuid: string;
  expirationAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type ListPpeFormDto = {
  data: ReadListPpeFormDto[];
  currentPage: number;
  totalPages: number;
  total: number;
};
