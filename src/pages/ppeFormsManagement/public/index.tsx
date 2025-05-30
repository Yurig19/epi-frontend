import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
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
import { useUpdatePpeForm } from '@/hooks/ppeForm/use-update-ppeForm';
import { PpeFormStatusEnum } from '@/enums/ppeFormStatus.enum';

export default function PublicPpeFormPage() {
  const { uuid } = useParams();

  const { mutate: updatePpeForm } = useUpdatePpeForm();
  const { data, isError } = useGetByUuidPpeFormPublic(uuid as string);

  const [isSigned, setIsSigned] = useState(false);

  async function onBiometricSign() {
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
        toast.success('Sucesso!', {
          description: 'Ficha assinada com sucesso!',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao autenticar com biometria.', {
        description: 'Verifique se a biometria está configurada corretamente.',
      });
    }
  }

  if (isError) return <p className='text-red-500'>Erro ao carregar ficha.</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <div className='max-w-4xl mx-auto p-8 space-y-6'>
      <h2 className='text-2xl font-bold'>Ficha de EPI</h2>

      <div className='border p-4 rounded-md space-y-2'>
        <p>
          <strong>Funcionário:</strong> {data.employeeData.name}
        </p>
        <p>
          <strong>CPF:</strong> {data.employeeData.document}
        </p>
        <p>
          <strong>Data de Nascimento:</strong>{' '}
          {format(new Date(data.employeeData.birthDate), 'dd/MM/yyyy')}
        </p>
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

      {!isSigned && (
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
