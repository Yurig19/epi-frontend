import { LayoutBase } from '@/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  getDashboardMetrics,
  getPpeStatusStats,
  getLastActivePpes,
} from '@/services/dashboard.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const COLORS = ['#22c55e', '#ef4444'];

export default function DashboardPage() {
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: getDashboardMetrics,
  });

  const { data: ppeStats, isLoading: loadingStats } = useQuery({
    queryKey: ['ppe-stats'],
    queryFn: getPpeStatusStats,
  });

  const { data: lastPpes, isLoading: loadingLastPpes } = useQuery({
    queryKey: ['last-active-ppes'],
    queryFn: getLastActivePpes,
  });

  const pieChartData = [
    { name: 'Ativo', value: ppeStats?.active || 0 },
    { name: 'Inativo', value: ppeStats?.inactive || 0 },
  ];

  return (
    <LayoutBase title='Dashboard'>
      <div className='p-6 space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card>
            <CardHeader>
              <CardTitle>Total de Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMetrics ? (
                <Skeleton className='h-6 w-20' />
              ) : (
                <p className='text-2xl font-bold'>{metrics?.totalEmployees}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total de Fichas de EPI</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMetrics ? (
                <Skeleton className='h-6 w-20' />
              ) : (
                <p className='text-2xl font-bold'>{metrics?.totalPpes}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total de Equipamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMetrics ? (
                <Skeleton className='h-6 w-20' />
              ) : (
                <p className='text-2xl font-bold'>{metrics?.totalPpes}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EPIs a Vencer</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMetrics ? (
                <Skeleton className='h-6 w-20' />
              ) : (
                <p className='text-2xl font-bold'>{metrics?.totalPpes ?? 0}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status dos EPIs</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className='h-48 w-full' />
            ) : (
              <div className='w-full h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      label
                    >
                      {pieChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas EPIs Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLastPpes ? (
              <Skeleton className='h-24 w-full' />
            ) : lastPpes?.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                Nenhuma EPI ativa encontrada.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>C.A</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lastPpes?.map((ppe: any) => (
                    <TableRow key={ppe.uuid}>
                      <TableCell>{ppe.name}</TableCell>
                      <TableCell>{ppe.caCode}</TableCell>
                      <TableCell>
                        {new Date(ppe.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutBase>
  );
}
