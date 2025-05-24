import api from '@/client/api';

export async function fetchDashboardData() {
  return await api.get<ReadDashboardData>('/dashboard/data');
}
