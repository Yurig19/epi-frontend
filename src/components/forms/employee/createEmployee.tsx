import { InputField } from '@/components/fields/input';
import type { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

interface CreateEmployeeFormProps {
  form: UseFormReturn<CreateEmployeeDto>;
  onSubmit: (data: CreateEmployeeDto) => void;
  isLoading?: boolean;
  isView?: boolean;
}

export function CreateEmployeeForm({
  form,
  onSubmit,
  isLoading,
  isView,
}: CreateEmployeeFormProps) {
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
          mask='(00) 0000-0000'
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

        <Button type='submit' disabled={isLoading ? isLoading : false}>
          Salvar
        </Button>
      </form>
    </Form>
  );
}
