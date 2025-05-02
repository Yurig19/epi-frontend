import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  cellStyle?: (item: T) => string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  total: number;
  actions?: (item: T) => React.ReactNode;
  itemsPerPageOptions?: number[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
};

const DataTableWithPagination = <T,>({
  columns,
  data,
  actions,
  total,
  itemsPerPageOptions = [5, 10, 15, 50, 100],
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: DataTableProps<T>) => {
  const totalPages = Math.ceil(total / itemsPerPage);
  const maxPageNumbersToShow = 5;
  const startPage = Math.max(
    1,
    currentPage - Math.floor(maxPageNumbersToShow / 2)
  );
  const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

  return (
    <div className='border border-border p-5 rounded-lg w-full max-w-screen-2xl mx-auto overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className='text-left'>
                {column.label}
              </TableHead>
            ))}
            {actions && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={String(item[columns[0].key])}>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  className={`text-left ${column.cellStyle ? column.cellStyle(item) : ''}`}
                >
                  {column.render
                    ? column.render(item)
                    : (item[column.key] as React.ReactNode)}
                </TableCell>
              ))}
              {actions && (
                <TableCell className='text-right flex items-center gap-2'>
                  {actions(item)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                  <Select
                    onValueChange={(value: string) =>
                      onItemsPerPageChange(Number(value))
                    }
                    defaultValue={String(itemsPerPage)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Itens por página' />
                    </SelectTrigger>
                    <SelectContent>
                      {itemsPerPageOptions.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href='#'
                        onClick={() =>
                          currentPage > 1 && onPageChange(currentPage - 1)
                        }
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: endPage - startPage + 1 },
                      (_, i) => startPage + i
                    ).map((pageNumber) => (
                      <PaginationItem key={`page-${pageNumber}`}>
                        <PaginationLink
                          href='#'
                          onClick={() => onPageChange(pageNumber)}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href='#'
                        onClick={() =>
                          currentPage < totalPages &&
                          onPageChange(currentPage + 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default DataTableWithPagination;
