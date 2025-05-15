type ReadAuditsListDto = {
  uuid: string;
  entity: string;
  method: string;
  url: string;
  userAgent: string;
  userUuid: string;
  newData: Json;
  oldData: Json;
  ip: string;
  createdAt: Date;
};

type ListAuditsDto = {
  data: ReadAuditsListDto[];
  actualPage: number;
  totalPages: number;
  total: number;
};
