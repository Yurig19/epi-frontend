import AlertDeleteDialog from '@/components/dialogs/alertDelete';
import { PpeDialog } from '@/components/dialogs/ppe/create-ppe';
import type { Column } from '@/components/table';
import DataTableWithPagination from '@/components/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeletePpe } from '@/hooks/ppe/use-delete-ppe';
import { useListPpe } from '@/hooks/ppe/use-list-ppe';
import { LayoutBase } from '@/layout';
import { formatDate } from '@/utils/format-date';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function PpeManagementsPage() {
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

  const { data, isPending, isError, error } = useListPpe(
    page,
    itensPerPage,
    search
  );

  const { mutate: deletePpe } = useDeletePpe();

  useEffect(() => {
    const params: Record<string, string> = {};

    if (search) params.search = search;
    if (itensPerPage) params.itensPerPage = String(itensPerPage);
    if (page) params.page = String(page);

    setSearchParams(params, { replace: true });
  }, [search, itensPerPage, page, setSearchParams]);

  useEffect(() => {
    if (isError && error) {
      console.error('Erro ao buscar as EPI:', error);
      toast.error('Erro ao buscar as EPI', {
        duration: 3000,
        description: 'Tente novamente mais tarde.',
        richColors: true,
      });
    }
  }, [isError, error]);

  const columns: Column<ReadListPpeDto>[] = [
    { key: 'name', label: 'Nome' },
    {
      key: 'description',
      label: 'Descrição',
      render: (item) => {
        const maxLength = 50;
        const text = item.description || '';
        return text.length > maxLength
          ? `${text.slice(0, maxLength)}...`
          : text;
      },
    },
    { key: 'caCode', label: 'C.A' },

    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const isActive = item.status?.toLowerCase() === 'active';
        return (
          <div className='flex items-center gap-2'>
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>{item.status === 'active' ? 'Ativo' : 'Inativo'}</span>
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
    <LayoutBase title='Gerenciamento de EPI'>
      <div className='flex flex-col'>
        <div className='w-full max-w-screen-2xl mx-auto mb-4'>
          <div className='flex justify-end'>
            <PpeDialog />
          </div>
        </div>
        <div className='flex justify-between p-4 mb-4 border border-border rounded-lg w-full max-w-screen-2xl mx-auto'>
          <div className='flex gap-4'>
            <div className='relative w-full'>
              <Input
                placeholder='Pesquisar pelo nome do equipamento'
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
            <Select onValueChange={setStatus} defaultValue='all'>
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
            <p className='text-center'>Nenhum Equipamento encontrado</p>
          </div>
        ) : (
          <DataTableWithPagination<ReadListPpeDto>
            columns={columns}
            data={data?.data ?? []}
            total={data?.total ?? 0}
            currentPage={page}
            itemsPerPage={itensPerPage}
            onItemsPerPageChange={setItensPerPage}
            onPageChange={setPage}
            actions={(item) => (
              <div className='flex items-center gap-2'>
                <PpeDialog isView defaultValues={item} />
                <PpeDialog isEdit defaultValues={item} />
                <AlertDeleteDialog
                  handleDelete={deletePpe}
                  element='EPI'
                  elementUuid={item.uuid}
                />
              </div>
            )}
          />
        )}
      </div>
    </LayoutBase>
  );
}
