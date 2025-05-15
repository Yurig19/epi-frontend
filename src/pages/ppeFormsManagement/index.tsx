import { CreatePpeFormDialog } from '@/components/dialogs/ppeForm/create-ppe';
import { DateRangePicker } from '@/components/rangePicker';
import DataTableWithPagination, { type Column } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useSelectEmployees } from '@/hooks/employee/use-select-employee';
import { useSelectPpe } from '@/hooks/ppe/use-select-ppe';
import { useListPpeForms } from '@/hooks/ppeForm/use-list-ppeForm';
import { LayoutBase } from '@/layout';
import { formatDate } from '@/utils/format-date';
import { Edit, Search, View } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function PpeFormManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [itensPerPage, setItensPerPage] = useState<number>(
    Number(searchParams.get('itensPerPage')) || 5
  );
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page')) || 1
  );
  const [search, setSearch] = useState<string>(
    searchParams.get('search') || ''
  );

  const [selectEmployee, setSelectEmployee] = useState<string>('');
  const [selectPpe, setSelectPpe] = useState<string>('');

  const [status, setStatus] = useState<string>(
    searchParams.get('status') || ''
  );

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const startDateParam = searchParams.get('startDate');
    return startDateParam ? new Date(startDateParam) : undefined;
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const endDateParam = searchParams.get('endDate');
    return endDateParam ? new Date(endDateParam) : undefined;
  });

  const { data: employeesOptions } = useSelectEmployees(selectEmployee);
  const { data: ppesOptions } = useSelectPpe(selectPpe);

  const { data, isPending, isError, error } = useListPpeForms(
    page,
    itensPerPage,
    search,
    status,
    startDate,
    endDate
  );

  useEffect(() => {
    const params: Record<string, string> = {};

    if (search) params.search = search;
    if (itensPerPage) params.itensPerPage = String(itensPerPage);
    if (page) params.page = String(page);
    if (status) params.status = status;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    setSearchParams(params, { replace: true });
  }, [search, itensPerPage, page, status, startDate, endDate, setSearchParams]);

  useEffect(() => {
    if (isError && error) {
      console.error('Erro ao buscar as Fichas de EPI:', error);
      toast.error('Erro ao buscar as Fichas de EPI', {
        duration: 3000,
        description: 'Tente novamente mais tarde.',
        richColors: true,
      });
    }
  }, [isError, error]);

  const columns: Column<ReadListPpeFormDto>[] = [
    { key: 'name', label: 'Nome' },
    {
      key: 'expirationAt',
      label: 'Validade',
      render: (item) =>
        item.expirationAt ? formatDate(item.expirationAt) : '-',
    },
    { key: 'signature', label: 'Assinatura' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const isActive = item.status?.toLowerCase() === 'ativo';
        return (
          <div className='flex items-center gap-2'>
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>{item.status ?? '-'}</span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (item) => formatDate(item.createdAt),
    },
  ];

  return (
    <LayoutBase title='Gerenciamento de Fichas EPI'>
      <div className='flex flex-col'>
        <div className='w-full max-w-screen-2xl mx-auto mb-4'>
          <div className='flex justify-end'>
            <CreatePpeFormDialog
              ppesOptions={ppesOptions ?? []}
              employeesOptions={employeesOptions ?? []}
            />
          </div>
        </div>
        <div className='flex justify-between p-4 mb-4 border border-border rounded-lg w-full max-w-screen-2xl mx-auto'>
          <div className='flex gap-4'>
            <div className='relative w-full'>
              <Input
                placeholder='Pesquisar ficha pelo funcionário, nome do equipamento'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10 w-96'
              />
              <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                <Search size={18} />
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
            <DateRangePicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
            <Select onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder='Pesquise pelo Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={'Todos'} value={'all'}>
                  Todos
                </SelectItem>
                <SelectItem key={'Ativo'} value={'active'}>
                  Ativo
                </SelectItem>
                <SelectItem key={'Inativo'} value={'inactive'}>
                  Inativo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isPending ? (
          <div className='border border-border p-5 rounded-lg w-full max-w-screen-2xl mx-auto'>
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={`skeleton-${index + 198}`}
                className='h-10 w-full mb-2'
              />
            ))}
          </div>
        ) : isError ? (
          <div className='border border-border p-5 rounded-lg w-full max-w-screen-2xl mx-auto'>
            <p className='text-red-500 text-center'>
              Erro ao buscar as fichas de epis
            </p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className='border border-border p-5 rounded-lg w-full max-w-screen-2xl mx-auto'>
            <p className='text-center'>Nenhuma ficha encontrada</p>
          </div>
        ) : (
          <DataTableWithPagination<ReadListPpeFormDto>
            columns={columns}
            data={data?.data ?? []}
            total={data?.total ?? 0}
            currentPage={page}
            itemsPerPage={itensPerPage}
            onItemsPerPageChange={setItensPerPage}
            onPageChange={setPage}
            actions={(item) => (
              <div className='flex items-center gap-2'>
                <Button variant='ghost' asChild>
                  <Link to={`/epi-managements/view/${item.uuid}`}>
                    <View className='w-4 h-4' />
                  </Link>
                </Button>
                <Button variant='ghost' asChild>
                  <Link to={`/epi-managements/edit/${item.uuid}`}>
                    <Edit className='w-4 h-4' />
                  </Link>
                </Button>
              </div>
            )}
          />
        )}
      </div>
    </LayoutBase>
  );
}
