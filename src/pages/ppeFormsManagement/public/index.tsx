import { useEffect, useState } from 'react';
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
import { PpeFormStatusEnum } from '@/enums/ppeFormStatus.enum';
import { useCreatePasskey } from '@/hooks/passkeys/use-create-passkey';
import { useVerifyPasskey } from '@/hooks/passkeys/use-verify-passkey';
import { usePatchStatusPpeForms } from '@/hooks/ppeForm/use-patch-status-ppeForms';

function bufferDecode(value: string) {
  return Uint8Array.from(
    atob(value.replace(/-/g, '+').replace(/_/g, '/')),
    (c) => c.charCodeAt(0)
  );
}
function bufferEncode(value: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export default function PublicPpeFormPage() {
  const { uuid, employeeUuid } = useParams();

  const { mutate: updatePpeForm } = usePatchStatusPpeForms();
  const { mutate: createPasskey } = useCreatePasskey();
  const { mutateAsync: verifyPasskey } = useVerifyPasskey();
  const { data, isError } = useGetByUuidPpeFormPublic(uuid as string);

  useEffect(() => {
    if (!employeeUuid) {
      toast.error('Funcionário não identificado.', {
        description: 'Verifique se o funcionário está correto.',
      });
    } else {
      setIsSigned(data?.status === PpeFormStatusEnum.SIGNED);
    }
  }, [employeeUuid, data?.status]);

  const [isSigned, setIsSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleBiometric() {
    if (!employeeUuid) {
      toast.error('Funcionário não identificado.', {
        richColors: true,
        description: 'Verifique se o funcionário está correto.',
      });
      return;
    }
    setLoading(true);
    try {
      const publicKeyOptions = {
        challenge: new Uint8Array(32),
        timeout: 60000,
        userVerification: 'required',
      } as PublicKeyCredentialRequestOptions;

      let assertion: PublicKeyCredential | null;
      try {
        assertion = (await navigator.credentials.get({
          publicKey: publicKeyOptions,
        })) as PublicKeyCredential;
      } catch (err) {
        assertion = null;
      }

      if (assertion) {
        const assertionResponse =
          assertion.response as AuthenticatorAssertionResponse;
        const verifyWebauthnPasskeyBodyDto = {
          assertion: {
            credentialId: bufferEncode(assertion.rawId),
            authenticatorData: bufferEncode(
              assertionResponse.authenticatorData
            ),
            clientDataJSON: bufferEncode(assertionResponse.clientDataJSON),
            signature: bufferEncode(assertionResponse.signature),
            userHandle: assertionResponse.userHandle
              ? bufferEncode(assertionResponse.userHandle)
              : undefined,
          },
          employeeUuid,
        };

        const result = await verifyPasskey({
          verifyWebauthnPasskeyBodyDto,
          employeeUuid,
        });

        if (result?.data?.authorized) {
          updatePpeForm({
            uuid: uuid as string,
            patchPpeFormsStatusDto: { status: PpeFormStatusEnum.SIGNED },
          });
          toast.success('Sucesso!', {
            description: 'Ficha assinada com sucesso!',
            richColors: true,
          });
          setIsSigned(true);
        } else {
          toast.error('Falha na autenticação da passkey.', {
            description: 'A biometria não foi validada pelo backend.',
          });
        }
      } else {
        const publicKey: PublicKeyCredentialCreationOptions = {
          challenge: new Uint8Array(32),
          rp: { name: 'EPI' },
          user: {
            id: bufferDecode(employeeUuid),
            name: employeeUuid,
            displayName: employeeUuid,
          },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          timeout: 60000,
          authenticatorSelection: { userVerification: 'required' },
          attestation: 'none' as AttestationConveyancePreference,
        };
        const credential = (await navigator.credentials.create({
          publicKey,
        })) as PublicKeyCredential;

        const attestationResponse =
          credential.response as AuthenticatorAttestationResponse;
        const deviceName = window.navigator.userAgent;

        createPasskey({
          createWebauthnPasskeyBodyDto: {
            registrationInfo: {
              credentialID: bufferEncode(credential.rawId),
              credentialPublicKey: bufferEncode(
                attestationResponse.attestationObject
              ),
              counter: 0,
              attestationFormat: '',
            },
            credential: {
              name: deviceName,
              transports: undefined,
            },
          },
          employeeUuid,
        });
        toast.success('Sucesso!', {
          description: 'Passkey registrada! Tente assinar novamente.',
          richColors: true,
        });
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Passkey not found')
      ) {
        toast.error('Erro ao autenticar/registrar biometria.', {
          description:
            'A passkey não foi encontrada. Tente novamente. Ou cadastre uma nova!!',
          richColors: true,
        });
      } else {
        toast.error('Erro ao autenticar/registrar biometria.', {
          richColors: true,
          description:
            'Verifique se a biometria está configurada corretamente.',
        });
        console.error(error);
      }
    } finally {
      setLoading(false);
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
          <Button onClick={handleBiometric} disabled={loading}>
            {loading ? 'Processando...' : 'Assinar com Digital'}
          </Button>
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
