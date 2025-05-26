import AlertDeleteDialog from '@/components/dialogs/alertDelete';
import { DepartmentDialog } from '@/components/dialogs/departments';
import DataTableWithPagination, { type Column } from '@/components/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DepartmentsStatusEnum } from '@/enums/departments.enum';
import { useDeleteDepartments } from '@/hooks/departments/use-delete-department';
import { useListDepartments } from '@/hooks/departments/use-list-departments';
import { LayoutBase } from '@/layout';
import { formatDate } from '@/utils/format-date';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function DepartmentsManagementPage() {
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

  const { data, isError, isPending, error } = useListDepartments(
    page,
    itensPerPage,
    search,
    startDate,
    endDate
  );

  const { mutate: deleteDepartments } = useDeleteDepartments();

  function handleDeleteDepartments(uuid: string) {
    deleteDepartments(uuid);
  }

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
      console.error('Erro ao buscar os Departamentos:', error);
      toast.error('Erro ao buscar os Departamentos', {
        duration: 3000,
        description: 'Tente novamente mais tarde.',
        richColors: true,
      });
    }
  }, [isError, error]);

  const columns: Column<ReadListDepartmentsDto>[] = [
    { key: 'name', label: 'Nome' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const isActive = item.status === DepartmentsStatusEnum.ACTIVE;

        return (
          <div className='flex items-center gap-2'>
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>
              {item.status === DepartmentsStatusEnum.ACTIVE
                ? 'Ativo'
                : 'Inativo'}
            </span>
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
    <LayoutBase title='Gerenciamento de Departamentos'>
      <div className='flex flex-col'>
        <div className='w-full max-w-screen-2xl mx-auto mb-4'>
          <div className='flex justify-end'>
            <DepartmentDialog />
          </div>
        </div>
        <div className='flex justify-between p-4 mb-4 border border-border rounded-lg w-full max-w-screen-2xl mx-auto'>
          <div className='flex gap-4'>
            <div className='relative w-full'>
              <Input
                placeholder='Pesquisar pelo nome do departamento'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10 w-96'
              />
              <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                <Search size={18} />
              </div>
            </div>
          </div>
          {/* <div className='flex gap-4'>
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
          </div> */}
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
              Erro ao buscar os departamentos
            </p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className='border border-border p-5 rounded-lg w-full max-w-screen-2xl mx-auto'>
            <p className='text-center'>Nenhuma departamento encontrado</p>
          </div>
        ) : (
          <DataTableWithPagination<ReadListDepartmentsDto>
            columns={columns}
            data={data?.data ?? []}
            total={data?.total ?? 0}
            currentPage={page}
            itemsPerPage={itensPerPage}
            onItemsPerPageChange={setItensPerPage}
            onPageChange={setPage}
            actions={(item) => (
              <div className='flex items-center gap-2'>
                <DepartmentDialog isView defaultValues={item} />
                <DepartmentDialog isEdit defaultValues={item} />
                <AlertDeleteDialog
                  element='Departamento'
                  elementUuid={item.uuid}
                  handleDelete={handleDeleteDepartments}
                />
              </div>
            )}
          />
        )}
      </div>
    </LayoutBase>
  );
}
