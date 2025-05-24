import { LayoutBase } from '@/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetDashboardData } from '@/hooks/dashboard/use-get-data';
import { formatDate } from '@/utils/format-date';

const COLORS = ['#22c55e', '#ef4444'];

export default function DashboardPage() {
  const { data, isPending } = useGetDashboardData();

  const pieChartData = [
    { name: 'Ativo', value: data?.totalPpeFormsActive || 0 },
    { name: 'Inativo', value: data?.totalPpeFormsInactive || 0 },
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
              {isPending ? (
                <Skeleton className='h-6 w-20' />
              ) : (
                <p className='text-2xl font-bold'>{data?.totalEmployee ?? 0}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total de Fichas de EPI</CardTitle>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <Skeleton className='h-6 w-20' />
              ) : (
                <p className='text-2xl font-bold'>{data?.totalPpeForms ?? 0}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total de Equipamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <Skeleton className='h-6 w-20' />
              ) : (
                <p className='text-2xl font-bold'>{data?.totalPpe ?? 0}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EPIs a Vencer</CardTitle>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <Skeleton className='h-6 w-20' />
              ) : (
                <p className='text-2xl font-bold'>
                  {data?.totalNotExpiredPpeForms ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status dos EPIs</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
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
                          key={`cell-${index + 123}`}
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
            {isPending ? (
              <Skeleton className='h-24 w-full' />
            ) : data?.lastPpeFormsActive?.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                Nenhuma EPI ativa encontrada.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.lastPpeFormsActive?.map(
                    (ppe: ReadLastPpeFormsActive) => (
                      <TableRow key={ppe.uuid}>
                        <TableCell>{ppe.employeeName}</TableCell>
                        <TableCell>{ppe.status}</TableCell>
                        <TableCell>{formatDate(ppe.createdAt)}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutBase>
  );
}
