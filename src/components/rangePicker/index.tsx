import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { CalendarIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';

type DateRangePickerProps = {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
};

export function DateRangePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DateRangePickerProps) {
  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <div className='relative'>
            <Button
              variant={'outline'}
              className={cn(
                'w-[140px] justify-start text-left font-normal pr-7',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {startDate ? (
                dayjs(startDate).format('DD/MM/YYYY')
              ) : (
                <span>Início</span>
              )}
            </Button>
            {startDate && (
              <Button
                size='icon'
                variant='ghost'
                className='absolute right-0 top-0 h-full'
                onClick={(e) => {
                  e.stopPropagation();
                  setStartDate(undefined);
                }}
              >
                <XIcon className='h-3 w-3 text-muted-foreground' />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={startDate}
            onSelect={(date) => setStartDate(date ?? undefined)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <div className='relative'>
            <Button
              variant={'outline'}
              className={cn(
                'w-[140px] justify-start text-left font-normal pr-7',
                !endDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {endDate ? dayjs(endDate).format('DD/MM/YYYY') : <span>Fim</span>}
            </Button>
            {endDate && (
              <Button
                size='icon'
                variant='ghost'
                className='absolute right-0 top-0 h-full'
                onClick={(e) => {
                  e.stopPropagation();
                  setEndDate(undefined);
                }}
              >
                <XIcon className='h-3 w-3 text-muted-foreground' />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={endDate}
            onSelect={(date) => setEndDate(date ?? undefined)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
