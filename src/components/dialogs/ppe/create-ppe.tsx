import { PpeForm } from '@/components/forms/ppe';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function CreatePpeDialog() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const form = useForm<CreatePpeDto>({});

  function onSubmit() {
    console.log(form.getValues());
  }

  return (
    <Dialog modal open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='outline'>Cadastrar EPIs</Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Cadastrar EPIs</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar os equipamentos de proteção
            individual.
          </DialogDescription>
        </DialogHeader>

        <PpeForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
