import { EmployeeForm } from '@/components/forms/employee';
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
import { createEmployeeSchema } from '@/schemas/employee.schema';
import { useState, useEffect } from 'react';
import { useCreateEmployee } from '@/hooks/employee/use-create-employee';
import { useUpdateEmployee } from '@/hooks/employee/use-update-employee';
import { Eye, Pencil } from 'lucide-react';
import { useSelectDepartments } from '@/hooks/departments/use-select-departments';
import { useGetByUuidPasskeyPublic } from '@/hooks/passkeys/use-get-passkey-public-by-uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SharePasskeyPopover } from '@/components/popover/sharePasskey';
import { useDeletePasskey } from '@/hooks/passkeys/use-delete-passkey';
import AlertDeleteDialog from '../alertDelete';

interface EmployeeDialogProps {
  defaultValues?: ReadListEmployeesDto;
  isEdit?: boolean;
  isView?: boolean;
}

type UpdatePayload = {
  uuid: string;
  updateEmployeeDto: CreateEmployeeDto;
};
export function EmployeeDialog({
  defaultValues,
  isEdit = false,
  isView = false,
}: EmployeeDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<CreateEmployeeDto>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEdit || (isView && defaultValues)) {
      if (defaultValues?.department) {
        form.setValue('departmentUuid', defaultValues.departmentUuid);
      }

      form.reset(defaultValues);
    }
  }, [defaultValues, isEdit, isView, form]);

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const { data: departmentsListOptions } = useSelectDepartments();

  const { data: passkeyData } = useGetByUuidPasskeyPublic(
    defaultValues?.uuid ?? ''
  );

  const { mutate: deletePasskey } = useDeletePasskey();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'Email already exists.':
        return 'Email já adicionado à plataforma!';
      case 'Phone already exists.':
        return 'Telefone já adicionado à plataforma!';
      case 'Document already exists.':
        return 'CPF já adicionado à plataforma!';
      default:
        return 'Tente novamente mais tarde!';
    }
  };

  const onSubmit = (data: CreateEmployeeDto) => {
    if (isEdit && defaultValues && defaultValues.uuid) {
      const payload: UpdatePayload = {
        uuid: defaultValues.uuid,
        updateEmployeeDto: data,
      };

      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Funcionário atualizado com sucesso!', {
            description: 'Os dados foram atualizados com sucesso.',
            richColors: true,
          });
          setOpenDialog(false);
          form.reset();
        },
        onError: (error) => {
          toast.error('Erro ao atualizar funcionário', {
            description: getErrorMessage(error.message ?? ''),
            richColors: true,
          });
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Funcionário criado com sucesso!', {
            description: 'O funcionário foi criado com sucesso.',
            richColors: true,
          });
          setOpenDialog(false);
          form.reset();
        },
        onError: (error) => {
          toast.error('Erro ao criar funcionário', {
            description: getErrorMessage(error.message ?? ''),
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
            <>{'Criar Novo Funcionário'}</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? 'Editar Funcionário'
              : isView
                ? 'Visualizar Dados do Funcionário'
                : 'Criar Novo Funcionário'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os campos desejados do funcionário.'
              : 'Preencha os campos abaixo para adicionar um novo funcionário.'}
          </DialogDescription>
        </DialogHeader>

        <EmployeeForm
          form={form}
          departmentsListOptions={departmentsListOptions ?? []}
          onSubmit={onSubmit}
          isLoading={isPending}
          isView={isView}
        />

        {(isView || isEdit) && (
          <Card>
            <CardHeader>
              <CardTitle>Passkeys</CardTitle>
            </CardHeader>

            <CardContent className='flex flex-col gap-4'>
              {passkeyData && Array.isArray(passkeyData) ? (
                <ul className='list-disc pl-5 space-y-2'>
                  {passkeyData.map((passkey) => (
                    <li key={passkey.uuid} className='flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full bg-primary' />
                      {passkey.name || 'Sem nome'}
                      {!isView && (
                        <AlertDeleteDialog
                          element='Passkey'
                          elementUuid={passkey.uuid}
                          handleDelete={deletePasskey}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <span>Nenhuma Passkey cadastrada.</span>
              )}
              {!isView && (
                <SharePasskeyPopover employeeUuid={defaultValues?.uuid ?? ''} />
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
