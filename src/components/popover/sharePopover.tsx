import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Copy, ShareIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SharePopover({ uuid }: { uuid: string }) {
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/ppeFormsManagement/public/${uuid}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link copiado com sucesso!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>
          <ShareIcon className='w-4 h-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] space-y-2'>
        <p className='text-sm font-medium'>Compartilhar ficha de EPI</p>
        <div className='bg-muted p-2 rounded text-sm break-all'>
          {publicUrl}
        </div>
        <Button
          onClick={handleCopy}
          variant='secondary'
          className='w-full'
          disabled={copied}
        >
          <Copy className='w-4 h-4 mr-2' />
          {copied ? 'Copiado!' : 'Copiar link'}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
