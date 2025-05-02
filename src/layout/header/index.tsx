import { ModeToggle } from '@/components/theme/mode-toogle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className='bg-background text-card-foreground  h-16 flex justify-between items-center px-10 py-10 w-full'>
      <div className='flex items-center gap-4 w-full'>
        <div className='relative flex-1 max-w-[600px]'>
          <Input
            type='text'
            placeholder='Pesquisar...'
            className='pl-4 pr-10 w-full py-5 rounded-xl'
          />
          <Button
            className='absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground'
            aria-label='Pesquisar'
            variant='ghost'
          >
            <Search />
          </Button>
        </div>
      </div>

      <div className='flex items-center gap-4 space-x-4'>
        <Button
          className='p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground'
          aria-label='Abrir notificações'
        >
          <Bell className='h-5 w-5' />
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
