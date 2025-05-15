export const getDashboardMetrics = async () => {
  return {
    totalEmployees: 42,
    totalPpes: 123,
  };
};

export const getPpeStatusStats = async () => {
  return {
    active: 88,
    inactive: 35,
  };
};

export const getLastActivePpes = async () => {
  return [
    {
      uuid: '1',
      name: 'Capacete de Segurança',
      caCode: '12345',
      createdAt: '2024-12-01',
    },
    {
      uuid: '2',
      name: 'Luva Térmica',
      caCode: '67890',
      createdAt: '2024-11-27',
    },
  ];
};
