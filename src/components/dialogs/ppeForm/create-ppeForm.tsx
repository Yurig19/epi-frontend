import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { PpeForms } from '@/components/forms/ppeForms';
import { useState } from 'react';

interface CreatePpeDialogProps {
  ppesOptions: SelectPpeDto[];
  employeesOptions: SelectEmployeesDto[];
}

export function CreatePpeFormDialog({
  ppesOptions,
  employeesOptions,
}: CreatePpeDialogProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      ppe: '',
      temp_quantity: 1,
    },
  });

  return (
    <Dialog modal open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='outline'>Cadastrar Ficha de EPIs</Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Cadastrar Ficha de EPIs</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar os equipamentos de proteção
            individual.
          </DialogDescription>
        </DialogHeader>

        <PpeForms
          form={form}
          ppesOptions={ppesOptions}
          employeesList={employeesOptions}
        />
      </DialogContent>
    </Dialog>
  );
}
