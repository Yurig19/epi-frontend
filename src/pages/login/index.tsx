import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/fields/input';
import { useAuth } from '@/contexts/authContexts';

const signInForm = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
});

type SignInForm = z.infer<typeof signInForm>;

export default function LoginPage() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
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

  async function handleSignIn(data: SignInForm) {
    try {
      await handleLogin(data);
      toast.success('Login realizado com sucesso!');
      navigate('/epi-management');
    } catch (error) {
      console.error(error);
      toast.error('Credenciais inválidas!', {
        richColors: true,
      });
    }
  }

  return (
    <div className='min-h-screen flex'>
      <div className='w-1/2 bg-foreground text-muted-foreground relative p-8'>
        <Button variant='ghost' asChild className='absolute top-8 left-8'>
          <Link to='/sign-up'>Novo estabelecimento</Link>
        </Button>
      </div>

      <div className='w-1/2 flex items-end justify-center p-12'>
        <div className='w-[350px] flex flex-col justify-end gap-6'>
          <div className='flex flex-col gap-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Acessar painel
            </h1>
            <p className='text-sm text-muted-foreground'>
              Acompanhe suas vendas pelo painel parceiro
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(handleSignIn)} className='space-y-4'>
              <InputField<SignInForm>
                control={control}
                name='email'
                label='Seu e-mail'
                placeholder='email@example.com'
                type='email'
              />

              <InputField<SignInForm>
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
