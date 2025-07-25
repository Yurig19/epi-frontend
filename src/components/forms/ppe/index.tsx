import { InputField } from '@/components/fields/input';
import type { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/fields/select';
import { TextareaField } from '@/components/fields/textArea';

interface PpeFormProps {
  form: UseFormReturn<CreatePpeDto>;
  onSubmit: (data: CreatePpeDto) => void;
  isLoading?: boolean;
  isView?: boolean;
}

export function PpeForm({ form, onSubmit, isView, isLoading }: PpeFormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <InputField
          name='name'
          label='Nome do Equipamento'
          control={control}
          placeholder='Digite o nome'
          disabled={isView ?? false}
        />

        <InputField
          name='caCode'
          label='C.A'
          control={control}
          placeholder='Digite o C.A'
          disabled={isView ?? false}
        />

        <TextareaField
          name='description'
          label='Descrição'
          control={control}
          placeholder='Digite a descrição'
          disabled={isView ?? false}
        />

        <SelectField
          control={control}
          label='Status'
          name='status'
          options={[
            {
              value: 'active',
              label: 'Ativo',
            },
            {
              value: 'inactive',
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
