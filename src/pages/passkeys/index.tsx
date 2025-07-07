import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreatePasskey } from '@/hooks/passkeys/use-create-passkey';
import { useGetByUuidEmployee } from '@/hooks/employee/use-get-by-uuid';

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

export default function PasskeyRegisterPage() {
  const { employeeUuid } = useParams();
  const { mutate: createPasskey } = useCreatePasskey();
  const [loading, setLoading] = useState(false);

  const { data: employee } = useGetByUuidEmployee(employeeUuid ?? '');

  async function handleRegisterPasskey() {
    if (!employeeUuid) {
      toast.error('Funcionário não identificado.', {
        description: 'Verifique se o funcionário está correto.',
        richColors: true,
      });
      return;
    }

    setLoading(true);
    try {
      const employeeName = employee?.name ?? '';

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: { name: 'EPI' },
        user: {
          id: bufferDecode(employeeUuid),
          name: employeeName,
          displayName: employeeName,
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
        richColors: true,
        description: 'Passkey registrada com sucesso!',
      });
    } catch (err: unknown) {
      toast.error('Erro ao registrar biometria.', {
        richColors: true,
        description: 'Verifique se a biometria está configurada corretamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='max-w-xl mx-auto p-8'>
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Biometria (Passkey)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            Clique no botão abaixo para cadastrar uma nova biometria para este
            funcionário.
          </p>
          <Button onClick={handleRegisterPasskey} disabled={loading}>
            {loading ? 'Processando...' : 'Cadastrar nova biometria'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
