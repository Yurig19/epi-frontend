type ReadLogsListDto = {
  uuid: string;
  error: string;
  statusCode: number;
  statusText: string;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
};

type ListLogsDto = {
  data: ReadListLogsDto[];
  total: number;
  actualPage: number;
  totalPages: number;
};
