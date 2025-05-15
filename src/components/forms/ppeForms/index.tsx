import { useState } from 'react';
import { SelectField } from '@/components/fields/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InputField } from '@/components/fields/input';

interface PpeItem {
  uuid: string;
  name: string;
  quantity: number;
}

interface PpeFormsProps {
  form: any;
  ppesOptions: SelectPpeDto[];
  employeesList: SelectEmployeesDto[];
}

export function PpeForms({ form, ppesOptions, employeesList }: PpeFormsProps) {
  const { control, setValue, watch } = form;
  const selectedPpeUuid = watch('ppe');
  const [quantity, setQuantity] = useState(1);
  const [ppeList, setPpeList] = useState<PpeItem[]>([]);

  console.log(employeesList);

  const handleAdd = () => {
    const selectedPpe = ppesOptions.find((ppe) => ppe.uuid === selectedPpeUuid);
    if (!selectedPpe || quantity <= 0) return;

    const alreadyExists = ppeList.find((ppe) => ppe.uuid === selectedPpeUuid);
    if (alreadyExists) {
      setPpeList((prev) =>
        prev.map((ppe) =>
          ppe.uuid === selectedPpeUuid ? { ...ppe, quantity } : ppe
        )
      );
    } else {
      setPpeList((prev) => [
        ...prev,
        { uuid: selectedPpe.uuid, name: selectedPpe.name, quantity },
      ]);
    }

    setQuantity(1);
    setValue('ppe', '');
  };

  const handleRemove = (uuid: string) => {
    setPpeList((prev) => prev.filter((ppe) => ppe.uuid !== uuid));
  };

  const handleQuantityChange = (uuid: string, newQuantity: number) => {
    setPpeList((prev) =>
      prev.map((ppe) =>
        ppe.uuid === uuid ? { ...ppe, quantity: newQuantity } : ppe
      )
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
        <SelectField
          control={control}
          label='Equipamentos'
          name='ppe'
          options={ppesOptions.map((option) => ({
            label: option.name,
            value: option.uuid,
          }))}
        />

        <div className='flex items-center space-x-2'>
          <InputField
            control={control}
            name='temp_quantity'
            label='Quantidade'
            type='number'
            rules={{ min: 1 }}
          />
          <Button type='button' onClick={handleAdd}>
            Adicionar
          </Button>
        </div>

        {ppeList.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ppeList.map((item) => (
                <TableRow key={item.uuid}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Input
                      type='number'
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.uuid, Number(e.target.value))
                      }
                      className='w-20'
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type='button'
                      variant='destructive'
                      onClick={() => handleRemove(item.uuid)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <SelectField
          control={control}
          label='Funcionário'
          name='ppe'
          options={employeesList.map((option) => ({
            label: option.name,
            value: option.uuid,
          }))}
        />
      </form>
    </Form>
  );
}
