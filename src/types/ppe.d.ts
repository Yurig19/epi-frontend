type CreatePpeDto = {
  name: string;
  caCode: string;
  description: string;
  status: string;
};

type ReadListPpeDto = {
  uuid: string;
  name: string;
  caCode: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type SelectPpeDto = {
  uuid: string;
  name: string;
};

type ListPpeDto = {
  data: ReadListPpeDto[];
  currentPage: number;
  totalPages: number;
  total: number;
};
