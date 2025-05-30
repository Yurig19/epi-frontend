import AlertDeleteDialog from '@/components/dialogs/alertDelete';
import { SharePopover } from '@/components/popover/sharePopover';
import DataTableWithPagination, { type Column } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeletePpeForms } from '@/hooks/ppeForm/use-delete-ppeForm';
import { useListPpeForms } from '@/hooks/ppeForm/use-list-ppeForm';
import { LayoutBase } from '@/layout';
import { formatDate } from '@/utils/format-date';
import { Eye, Pencil, Search } from 'lucide-react';
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

  const { data, isPending, isError, error } = useListPpeForms(
    page,
    itensPerPage,
    search
  );

  const { mutate: deletePpeForms } = useDeletePpeForms();

  useEffect(() => {
    const params: Record<string, string> = {};

    if (search) params.search = search;
    if (itensPerPage) params.itensPerPage = String(itensPerPage);
    if (page) params.page = String(page);

    setSearchParams(params, { replace: true });
  }, [search, itensPerPage, page, setSearchParams]);

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
    { key: 'employeeName', label: 'Funcionário' },
    {
      key: 'expirationAt',
      label: 'Validade',
      render: (item) =>
        item.expirationAt ? formatDate(item.expirationAt) : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const status = item.status?.toUpperCase();

        const statusColorMap: Record<string, string> = {
          PENDING: 'bg-yellow-500',
          SIGNED: 'bg-green-600',
          EXPIRED: 'bg-red-500',
        };

        const statusLabelMap: Record<string, string> = {
          PENDING: 'Pendente',
          SIGNED: 'Assinado',
          EXPIRED: 'Vencido',
        };

        const bgColor = statusColorMap[status] ?? 'bg-gray-400';
        const translatedLabel = statusLabelMap[status] ?? '-';

        return (
          <div className='flex items-center gap-2'>
            <span className={`w-2 h-2 rounded-full ${bgColor}`} />
            <span>{translatedLabel}</span>
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
            <Button asChild variant='outline'>
              <Link to='/ppeFormsManagement/create'>
                Cadastrar nova Ficha de EPI
              </Link>
            </Button>
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
                <SharePopover uuid={item.uuid} />
                <Button variant='outline' asChild>
                  <Link to={`/ppeFormsManagement/view/${item.uuid}`}>
                    <Eye className='w-4 h-4' />
                  </Link>
                </Button>
                <Button variant='outline' asChild>
                  <Link to={`/ppeFormsManagement/edit/${item.uuid}`}>
                    <Pencil className='w-4 h-4' />
                  </Link>
                </Button>
                <AlertDeleteDialog
                  element='Ficha de EPI'
                  elementUuid={item.uuid}
                  handleDelete={deletePpeForms}
                />
              </div>
            )}
          />
        )}
      </div>
    </LayoutBase>
  );
}
