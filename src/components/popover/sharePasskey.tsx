import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Copy, Share } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SharePasskeyPopover({
  employeeUuid,
  isEdit = false,
}: { employeeUuid: string; isEdit?: boolean }) {
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/passkeys/${employeeUuid}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Sucesso!', {
        richColors: true,
        description: 'Link copiado com sucesso!',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar link', {
        richColors: true,
        description: 'Verifique se o link está correto.',
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {isEdit ? (
          <Button variant='outline'>Adicionar</Button>
        ) : (
          <Button variant='outline'>
            <Share size={16} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className='w-[300px] space-y-2'>
        <p className='text-sm font-medium'>
          Compartilhar link para cadastro de passkey
        </p>
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
