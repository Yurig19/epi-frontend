import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetByUuidPpeFormPublic } from '@/hooks/ppeForm/use-get-by-uuid-ppeForm-public';
import { InputField } from '@/components/fields/input';
import { Input } from '@/components/ui/input';
import dayjs from 'dayjs';
import { useUpdatePpeForm } from '@/hooks/ppeForm/use-update-ppeForm';
import { PpeFormStatusEnum } from '@/enums/ppeFormStatus.enum';

const validationSchema = z.object({
  cpf: z.string().min(11, 'CPF inválido'),
  birthDate: z.string().min(10, 'Data inválida'),
});

type ValidationFormData = z.infer<typeof validationSchema>;

export default function PublicPpeFormPage() {
  const { uuid } = useParams();

  const { mutate: updatePpeForm } = useUpdatePpeForm();
  const { data, isError } = useGetByUuidPpeFormPublic(uuid as string);

  const form = useForm<ValidationFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      cpf: '',
      birthDate: '',
    },
  });

  const { handleSubmit, control } = form;

  const [isValidated, setIsValidated] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const onValidate = (values: ValidationFormData) => {
    console.log(values);
    if (!data) return;

    const birthDateEmployee = data.employeeData?.birthDate
      ? dayjs(data.employeeData.birthDate).format('DD/MM/YYYY')
      : '';

    const matchesCpf = values.cpf === data.employeeData.document;
    const matchesDob =
      dayjs(values.birthDate).format('DD/MM/YYYY') === birthDateEmployee;

    if (matchesCpf && matchesDob) {
      setIsValidated(true);
      toast.success('Dados validados!', {
        description: 'Agora, autentique-se com sua digital!',
        richColors: true,
      });
    } else {
      toast.error('CPF ou data de nascimento incorretos.', {
        richColors: true,
      });
    }
  };

  const onBiometricSign = async () => {
    try {
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32),
        timeout: 60000,
        userVerification: 'required' as UserVerificationRequirement,
      };

      const credential = await navigator.credentials.get({ publicKey });

      if (credential) {
        setIsSigned(true);
        updatePpeForm({
          uuid: uuid as string,
          updatePpeFormDto: { status: PpeFormStatusEnum.SIGNED },
        });
        toast.success('Ficha assinada com sucesso!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao autenticar com biometria.');
    }
  };

  if (isError) return <p className='text-red-500'>Erro ao carregar ficha.</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <div className='max-w-4xl mx-auto p-8 space-y-6'>
      <h2 className='text-2xl font-bold'>Ficha de EPI</h2>

      <div className='border p-4 rounded-md space-y-2'>
        <p>
          <strong>Funcionário:</strong> {data.employeeData.name}
        </p>
        {isValidated && (
          <>
            <p>
              <strong>CPF:</strong> {data.employeeData.document}
            </p>
            <p>
              <strong>Data de Nascimento:</strong>{' '}
              {format(new Date(data.employeeData.birthDate), 'dd/MM/yyyy')}
            </p>
          </>
        )}
        <p>
          <strong>Data de Vencimento:</strong>{' '}
          {format(new Date(data.expirationAt), 'dd/MM/yyyy')}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipamento</TableHead>
            <TableHead>Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.equipments.map((item) => (
            <TableRow key={item.uuid}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!isValidated && !isSigned && (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onValidate)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-6'
          >
            <InputField
              control={control}
              name='cpf'
              label='CPF'
              placeholder='Digite seu CPF'
              mask='000.000.000-00'
            />

            <FormField
              control={form.control}
              name='birthDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='md:col-span-2'>
              <Button variant='outline' type='submit'>
                Confirmar Dados
              </Button>
            </div>
          </form>
        </Form>
      )}

      {isValidated && !isSigned && (
        <div className='pt-4'>
          <Button onClick={onBiometricSign}>Assinar com Digital</Button>
        </div>
      )}

      {isSigned && (
        <div className='pt-4 text-green-600 font-semibold'>
          ✅ Ficha assinada com sucesso!
        </div>
      )}
    </div>
  );
}
