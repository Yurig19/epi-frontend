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
import { useCreatePpe } from '@/hooks/ppe/use-create-ppe';
import { useUpdatePpe } from '@/hooks/ppe/use-update-ppe';
import { createPpeSchema } from '@/schemas/ppe.schma';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PpeDialog {
  isEdit?: boolean;
  isView?: boolean;
  defaultValues?: ReadListPpeDto;
}

type UpdatePayload = {
  uuid: string;
  updatePpeDto: CreatePpeDto;
};

export function PpeDialog({ defaultValues, isEdit, isView }: PpeDialog) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const createMutation = useCreatePpe();
  const updateMutation = useUpdatePpe();

  const form = useForm<CreatePpeDto>({
    resolver: zodResolver(createPpeSchema),
    defaultValues: {
      name: '',
      caCode: '',
      status: 'active',
      description: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name ?? '',
        caCode: defaultValues.caCode ?? '',
        status: defaultValues.status ?? 'active',
        description: defaultValues.description ?? '',
      });
    }
  }, [defaultValues, form]);

  function onSubmit(data: CreatePpeDto) {
    if (isEdit && defaultValues?.uuid) {
      const payload: UpdatePayload = {
        uuid: defaultValues.uuid,
        updatePpeDto: data,
      };
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Equipamento atualizado com sucesso!', {
            description: 'Os dados foram atualizados corretamente.',
            richColors: true,
          });
          setOpenDialog(false);
        },
        onError: (error) => {
          toast.error('Erro ao atualizar o equipamento', {
            description: error.message ?? 'Erro desconhecido.',
            richColors: true,
          });
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Equipamento criado com sucesso!', {
            description: 'O equipamento foi cadastrado corretamente.',
            richColors: true,
          });
          setOpenDialog(false);
          form.reset();
        },
        onError: (error) => {
          toast.error('Erro ao criar o equipamento', {
            description: error.message ?? 'Erro desconhecido.',
            richColors: true,
          });
        },
      });
    }
  }

  return (
    <Dialog modal open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          {isView ? (
            <Eye className='h-4 w-4' />
          ) : isEdit ? (
            <Pencil className='h-4 w-4' />
          ) : (
            <>
              <Plus className='h-4 w-4' />
              Cadastrar um novo EPI
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? 'Editar EPI'
              : isView
                ? 'Visualizar EPI'
                : 'Cadastrar Novo EPI'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os campos desejados do equipamento.'
              : 'Preencha os campos abaixo para adicionar um novo EPI.'}
          </DialogDescription>
        </DialogHeader>

        <PpeForm form={form} onSubmit={onSubmit} isView={isView} />
      </DialogContent>
    </Dialog>
  );
}
