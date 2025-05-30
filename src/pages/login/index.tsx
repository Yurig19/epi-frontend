import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputField } from '@/components/fields/input';
import { useAuth } from '@/contexts/authContexts';
import { authLogin } from '@/schemas/auth.schema';

export default function LoginPage() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const form = useForm<AuthLoginDto>({
    resolver: zodResolver(authLogin),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function handleSignIn(data: AuthLoginDto) {
    try {
      await handleLogin(data);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Credenciais inválidas!', {
        richColors: true,
      });
    }
  }

  return (
    <div className='min-h-screen flex'>
      <div className='w-1/2 bg-foreground text-muted-foreground relative p-8' />

      <div className='w-1/2 flex items-end justify-center p-12'>
        <div className='w-[350px] flex flex-col justify-end gap-6'>
          <div className='flex flex-col gap-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Acessar painel
            </h1>
            <p className='text-sm text-muted-foreground'>
              Faça o login com suas credenciais para acessar o painel.{' '}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(handleSignIn)} className='space-y-4'>
              <InputField
                control={control}
                name='email'
                label='Seu e-mail'
                placeholder='email@example.com'
                type='email'
              />

              <InputField
                control={control}
                name='password'
                label='Sua senha'
                placeholder='******'
                type='password'
              />

              <Button disabled={isSubmitting} className='w-full' type='submit'>
                Acessar painel
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
