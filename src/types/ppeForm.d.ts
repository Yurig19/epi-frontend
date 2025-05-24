type LinkedEquipmentsPpeForms = {
  ppeUuid: string;
  quantity: number;
};

type CreatePpeFormDto = {
  employeeUuid: string;
  status: string;
  expirationAt: Date;
  linkedEquipments: LinkedEquipmentsPpeForms[];
};

type UpdatePpeFormDto = {
  employeeUuid?: string;
  status?: string;
  expirationAt?: Date;
  linkedEquipments?: LinkedEquipmentsPpeForms[];
};

type ReadListPpeFormDto = {
  uuid: string;
  status: string;
  employeeUuid: string;
  employeeName: string;
  expirationAt: Date;
  createdAt: Date;
};

type ReadEmployeeDataPpeFormDto = {
  uuid: string;
  name: string;
};

type ReadEquipmentsPpeFormsDto = {
  uuid: string;
  name: string;
  quantity: number;
};

type ReadPpeFormDto = {
  uuid: string;
  status: string;
  expirationAt: Date;
  employeeData: ReadEmployeeDataPpeFormDto;
  equipments: ReadEquipmentsPpeFormsDto[];
};

type ReadEmployeeDataPpeFormPublicDto = {
  uuid: string;
  name: string;
  document: string;
  birthDate: Date;
};

type ReadEquipmentsPpeFormsPublicDto = {
  uuid: string;
  name: string;
  quantity: number;
};

type ReadPpeFormPublicDto = {
  uuid: string;
  status: string;
  expirationAt: Date;
  employeeData: ReadEmployeeDataPpeFormPublicDto;
  equipments: ReadEquipmentsPpeFormsPublicDto[];
};

type ListPpeFormDto = {
  data: ReadListPpeFormDto[];
  currentPage: number;
  totalPages: number;
  total: number;
};
