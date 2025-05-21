import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Eye, Pencil } from 'lucide-react';
import { useCreateDepartment } from '@/hooks/departments/use-create-department';
import { useUpdateDepartment } from '@/hooks/departments/use-update-department';
import { DepartmentsForm } from '@/components/forms/departments';
import { createDepartmentSchema } from '@/schemas/departments.schema';

interface DepartmentDialogProps {
  defaultValues?: ReadListDepartmentsDto;
  isEdit?: boolean;
  isView?: boolean;
}

type UpdatePayload = {
  uuid: string;
  updateDepartmentDto: CreateDepartmentDto;
};
export function DepartmentDialog({
  defaultValues,
  isEdit = false,
  isView = false,
}: DepartmentDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<CreateDepartmentDto>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEdit || (isView && defaultValues)) {
      form.reset(defaultValues);
    }
  }, [defaultValues, isEdit, isView, form]);

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: CreateDepartmentDto) => {
    if (isEdit && defaultValues && defaultValues.uuid) {
      const payload: UpdatePayload = {
        uuid: defaultValues.uuid,
        updateDepartmentDto: data,
      };

      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Departamento atualizado com sucesso!', {
            description: 'Os dados foram atualizados com sucesso.',
            richColors: true,
          });
          setOpenDialog(false);
          form.reset();
        },
        onError: () => {
          toast.error('Erro ao atualizar o departamento', {
            description: 'Tente novamente mais tarde!',
            richColors: true,
          });
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Departamento criado com sucesso!', {
            description: 'O Departamento foi criado com sucesso.',
            richColors: true,
          });
          setOpenDialog(false);
          form.reset();
        },
        onError: () => {
          toast.error('Erro ao criar Departamento', {
            description: 'Tente novamente mais tarde!',
            richColors: true,
          });
        },
      });
    }
  };

  return (
    <Dialog modal open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          {isView ? (
            <>
              <Eye className='h-4 w-4' />
            </>
          ) : isEdit ? (
            <>
              <Pencil className='h-4 w-4' />
            </>
          ) : (
            <>{'Criar Novo Departamento'}</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? 'Editar Departamento'
              : isView
                ? 'Visualizar Dados do departamento'
                : 'Criar Novo Departamento'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os campos desejados do departamentos.'
              : 'Preencha os campos abaixo para adicionar um novo departamentos.'}
          </DialogDescription>
        </DialogHeader>

        <DepartmentsForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isPending}
          isView={isView}
        />
      </DialogContent>
    </Dialog>
  );
}
