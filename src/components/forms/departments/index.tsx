import { InputField } from '@/components/fields/input';
import type { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/fields/select';
import { DepartmentsStatusEnum } from '@/enums/departments.enum';

interface DepartmentsFormProps {
  form: UseFormReturn<CreateDepartmentDto>;
  onSubmit: (data: CreateDepartmentDto) => void;
  isLoading?: boolean;
  isView?: boolean;
}

export function DepartmentsForm({
  form,
  onSubmit,
  isView,
  isLoading,
}: DepartmentsFormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <InputField
          name='name'
          label='Nome do departamento'
          control={control}
          placeholder='Digite o nome'
          disabled={isView ?? false}
        />

        <SelectField
          control={control}
          label='Status'
          name='status'
          options={[
            {
              value: DepartmentsStatusEnum.ACTIVE,
              label: 'Ativo',
            },
            {
              value: DepartmentsStatusEnum.INACTIVE,
              label: 'Inativo',
            },
          ]}
          disabled={isView ?? false}
        />

        <Button type='submit' disabled={isLoading ?? false}>
          Salvar
        </Button>
      </form>
    </Form>
  );
}
