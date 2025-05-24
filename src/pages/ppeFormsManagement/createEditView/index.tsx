import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Edit, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { LayoutBase } from '@/layout';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelectEmployees } from '@/hooks/employee/use-select-employee';
import { useSelectPpe } from '@/hooks/ppe/use-select-ppe';
import { createPpeFormSchema } from '@/schemas/ppeForm.schema';
import { useGetByUuidPpeForm } from '@/hooks/ppeForm/use-get-by-uuid-ppeForm';
import { toast } from 'sonner';
import { useCreatePpeForm } from '@/hooks/ppeForm/use-create-ppeForm';
import { useUpdatePpeForm } from '@/hooks/ppeForm/use-update-ppeForm';

export default function CreateEditViewPpeFormsPage() {
  const form = useForm<CreatePpeFormDto>({
    resolver: zodResolver(createPpeFormSchema),
    defaultValues: {
      status: 'PENDING',
      employeeUuid: '',
      expirationAt: new Date(),
      linkedEquipments: [],
    },
  });

  const { uuid } = useParams();
  const location = useLocation();

  const isView = location.pathname.includes('/view');
  const isEdit = location.pathname.includes('/edit');

  const navigate = useNavigate();

  const { control, handleSubmit } = form;

  const pageTitle = isEdit
    ? 'Editar ficha de EPI'
    : isView
      ? 'Visualizar Ficha de EPI'
      : 'Cadastrar nova ficha de EPI';

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'linkedEquipments',
  });

  const { data: employeeList } = useSelectEmployees();
  const { data: ppeList } = useSelectPpe();

  const { data, error, isError } = useGetByUuidPpeForm(uuid as string);

  const { mutate: createPpeForm } = useCreatePpeForm();
  const { mutate: updatePpeForm } = useUpdatePpeForm();

  const [selectedPpe, setSelectedPpe] = useState('');
  const [quantity, setQuantity] = useState<number>(1);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editPpeUuid, setEditPpeUuid] = useState('');
  const [editQuantity, setEditQuantity] = useState(1);

  const onAddPpe = () => {
    if (!selectedPpe || quantity <= 0) return;
    append({ ppeUuid: selectedPpe, quantity });
    setSelectedPpe('');
    setQuantity(1);
  };

  const onEditStart = (index: number) => {
    const item = fields[index];
    setEditingIndex(index);
    setEditPpeUuid(item.ppeUuid);
    setEditQuantity(item.quantity);
  };

  const onEditCancel = () => {
    setEditingIndex(null);
    setEditPpeUuid('');
    setEditQuantity(1);
  };

  const onEditSave = () => {
    if (!editPpeUuid || editQuantity <= 0 || editingIndex === null) return;
    update(editingIndex, { ppeUuid: editPpeUuid, quantity: editQuantity });
    setEditingIndex(null);
    setEditPpeUuid('');
    setEditQuantity(1);
  };

  const onSubmit = (data: CreatePpeFormDto) => {
    if (isEdit) {
      updatePpeForm({ uuid: uuid as string, updatePpeFormDto: data });
      navigate('/ppeFormsManagements');
      return;
    }
    createPpeForm(data);
    navigate('/ppeFormsManagements');
  };

  useEffect(() => {
    if (isError && error) {
      console.error('Erro ao buscar as EPI:', error);
      toast.error('Erro ao buscar as EPI', {
        duration: 3000,
        description: 'Tente novamente mais tarde.',
        richColors: true,
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (data) {
      form.reset({
        employeeUuid: data.employeeData.uuid,
        expirationAt: new Date(data.expirationAt),
        linkedEquipments:
          data.equipments && Array.isArray(data.equipments)
            ? data.equipments.map((equipment) => ({
                ppeUuid: equipment.uuid,
                quantity: equipment.quantity,
              }))
            : [],
        status: data.status ?? 'PENDING',
      });
    }
  }, [data, form]);

  return (
    <LayoutBase
      title={pageTitle}
      breadCrumbItems={[
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Gerenciamento de Fichas EPI', route: '/ppeFormsManagements' },
      ]}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-10 max-w-5xl mx-auto p-8'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <FormField
              control={control}
              name='employeeUuid'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funcionário</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isView}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um funcionário' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeeList?.map((emp) => (
                        <SelectItem key={emp.uuid} value={emp.uuid}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='expirationAt'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          disabled={isView}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {field.value
                            ? format(field.value, 'dd/MM/yyyy')
                            : 'Selecionar data'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isView && (
            <div className='border-t pt-8 space-y-8'>
              <h3 className='text-lg font-medium'>Adicionar Equipamento</h3>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-end'>
                <div>
                  <FormLabel className='mb-3'>EPI</FormLabel>
                  <Select value={selectedPpe} onValueChange={setSelectedPpe}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione um EPI' />
                    </SelectTrigger>
                    <SelectContent>
                      {ppeList?.map((ppe) => (
                        <SelectItem key={ppe.uuid} value={ppe.uuid}>
                          {ppe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-3'>
                  <FormLabel>Quantidade</FormLabel>
                  <Input
                    type='number'
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                <Button type='button' onClick={onAddPpe}>
                  Adicionar
                </Button>
              </div>
            </div>
          )}

          {fields.length > 0 && (
            <div className='border-t pt-8 space-y-6'>
              <h3 className='text-lg font-medium'>EPIs Vinculados</h3>

              <div className='w-full overflow-x-auto'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipamento</TableHead>
                      <TableHead>Quantidade</TableHead>
                      {!isView && <TableHead>Ações</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((item, index) => {
                      const isEditing = editingIndex === index;

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {isEditing ? (
                              <Select
                                value={editPpeUuid}
                                onValueChange={setEditPpeUuid}
                                disabled={isView}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Selecione um EPI' />
                                </SelectTrigger>
                                <SelectContent>
                                  {ppeList?.map((ppe) => (
                                    <SelectItem key={ppe.uuid} value={ppe.uuid}>
                                      {ppe.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              (ppeList?.find((e) => e.uuid === item.ppeUuid)
                                ?.name ?? 'EPI não encontrado')
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type='number'
                                min={1}
                                value={editQuantity}
                                onChange={(e) =>
                                  setEditQuantity(Number(e.target.value))
                                }
                                disabled={isView}
                              />
                            ) : (
                              item.quantity
                            )}
                          </TableCell>
                          {!isView && (
                            <TableCell className='space-x-2'>
                              {isEditing ? (
                                <>
                                  <Button
                                    type='button'
                                    variant='secondary'
                                    onClick={onEditCancel}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    type='button'
                                    onClick={onEditSave}
                                    disabled={!editPpeUuid || editQuantity < 1}
                                  >
                                    Salvar
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => onEditStart(index)}
                                  >
                                    <Edit />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='destructive'
                                    onClick={() => remove(index)}
                                  >
                                    <Trash />
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {!isView && (
            <div className='pt-8'>
              <Button type='submit'>Salvar Ficha de EPI</Button>
            </div>
          )}
        </form>
      </Form>
    </LayoutBase>
  );
}
