type ReadLastPpeFormsActive = {
  uuid: string;
  employeeName: string;
  status: PpeFormStatusEnum;
  createdAt: Date;
};

type ReadDashboardData = {
  totalEmployee: number;
  totalPpeForms: number;
  totalPpe: number;
  totalNotExpiredPpeForms: number;
  totalPpeFormsActive: number;
  totalPpeFormsInactive: number;
  lastPpeFormsActive: ReadLastPpeFormsActive[];
};
