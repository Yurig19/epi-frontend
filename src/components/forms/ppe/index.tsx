import { InputField } from '@/components/fields/input';
import type { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

interface PpeFormProps {
  form: UseFormReturn<CreatePpeDto>;
  onSubmit: (data: CreatePpeDto) => void;
}

export function PpeForm({ form, onSubmit }: PpeFormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <InputField
          name='name'
          label='Nome do Equipamento'
          control={control}
          placeholder='Digite o nome'
        />

        <InputField
          name='caCode'
          label='C.A'
          control={control}
          placeholder='Digite o C.A'
        />

        <InputField
          name='description'
          label='Descrição'
          control={control}
          placeholder='Digite a descrição'
        />

        <Button type='submit'>Salvar</Button>
      </form>
    </Form>
  );
}
