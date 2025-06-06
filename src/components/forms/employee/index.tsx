import { InputField } from '@/components/fields/input';
import type { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/fields/select';
import { DatePickerField } from '@/components/fields/date';

interface EmployeeFormProps {
  form: UseFormReturn<CreateEmployeeDto>;
  onSubmit: (data: CreateEmployeeDto) => void;
  departmentsListOptions: SelectDepartmentsDto[];
  isLoading?: boolean;
  isView?: boolean;
}

export function EmployeeForm({
  form,
  onSubmit,
  isLoading,
  isView,
  departmentsListOptions,
}: EmployeeFormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <InputField
          name='name'
          label='Nome do Funcionário'
          control={control}
          disabled={isView ? isView : false}
          placeholder='Digite o nome'
        />

        <InputField
          name='phone'
          label='Telefone'
          control={control}
          disabled={isView ? isView : false}
          placeholder='Digite o Telefone'
          mask='(00) 00000-0000'
        />

        <InputField
          name='email'
          label='E-mail'
          control={control}
          disabled={isView ? isView : false}
          placeholder='Digite o email'
        />

        <InputField
          name='position'
          label='Função'
          control={control}
          disabled={isView ? isView : false}
          placeholder='Digite a função do funcionário'
        />

        <InputField
          name='document'
          label='CPF'
          control={control}
          disabled={isView ? isView : false}
          placeholder='Digite o cpf do funcionário'
          mask='000.000.000-00'
        />

        <InputField
          name='birthDate'
          label='Data de nascimento'
          control={control}
          disabled={isView ? isView : false}
          type='date'
        />

        <DatePickerField
          control={control}
          name='dateOfAdmission'
          label='Data de Admissão'
          disabled={isView ? isView : false}
        />

        <SelectField
          control={control}
          label='Setor'
          name='departmentUuid'
          disabled={isView ? isView : false}
          options={
            departmentsListOptions && Array.isArray(departmentsListOptions)
              ? departmentsListOptions.map((department) => ({
                  value: department.uuid,
                  label: department.name,
                }))
              : []
          }
        />

        {!isView && (
          <Button type='submit' disabled={isLoading ? isLoading : false}>
            Salvar
          </Button>
        )}
      </form>
    </Form>
  );
}
