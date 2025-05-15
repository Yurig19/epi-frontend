import { DateRangePicker } from '@/components/rangePicker';
import DataTableWithPagination, { type Column } from '@/components/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useListErrorsLogs } from '@/hooks/errorsLog/use-list-logs';
import { LayoutBase } from '@/layout';
import { formatDate } from '@/utils/format-date';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ErrorLogsPage() {
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

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const startDateParam = searchParams.get('startDate');
    return startDateParam ? new Date(startDateParam) : undefined;
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const endDateParam = searchParams.get('endDate');
    return endDateParam ? new Date(endDateParam) : undefined;
  });

  const { data, error, isError, isPending } = useListErrorsLogs(
    page,
    itensPerPage,
    search,
    startDate,
    endDate
  );

  useEffect(() => {
    const params: Record<string, string> = {};

    if (search) params.search = search;
    if (itensPerPage) params.itensPerPage = String(itensPerPage);
    if (page) params.page = String(page);
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    setSearchParams(params, { replace: true });
  }, [search, itensPerPage, page, startDate, endDate, setSearchParams]);

  useEffect(() => {
    if (isError && error) {
      console.error('Erro ao buscar os logs:', error);
      toast.error('Erro ao buscar os logs', {
        duration: 3000,
        description: 'Tente novamente mais tarde.',
        richColors: true,
      });
    }
  }, [isError, error]);

  const columns: Column<ReadLogsListDto>[] = [
    { key: 'error', label: 'Erro' },
    { key: 'path', label: 'URL' },
    { key: 'method', label: 'Ação' },
    { key: 'ip', label: 'IP' },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (item) => formatDate(item.createdAt),
    },
  ];

  return (
    <LayoutBase title='Listagem de erros'>
      <div className='flex flex-col'>
        <div className='flex justify-between p-4 mb-4 border border-border rounded-lg w-full max-w-screen-2xl mx-auto'>
          <div className='flex gap-4'>
            <div className='relative w-full'>
              <Input
                placeholder='Pesquisar os logs'
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
              Erro ao buscar os Logs de Erro
            </p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className='border border-border p-5 rounded-lg w-full max-w-screen-2xl mx-auto'>
            <p className='text-center'>Nenhum Log de erro encontrado!</p>
          </div>
        ) : (
          <DataTableWithPagination<ReadLogsListDto>
            columns={columns}
            data={data?.data ?? []}
            total={data?.total ?? 0}
            currentPage={page}
            itemsPerPage={itensPerPage}
            onItemsPerPageChange={setItensPerPage}
            onPageChange={setPage}
          />
        )}
      </div>
    </LayoutBase>
  );
}
