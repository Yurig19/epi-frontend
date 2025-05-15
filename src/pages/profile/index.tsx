import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LayoutBase } from '@/layout';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ImageField } from '@/components/fields/image';
import { InputField } from '@/components/fields/input';
import { useAuth } from '@/contexts/authContexts';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  avatar: z.any().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      avatar: '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: ProfileForm) => {
    console.log('Dados enviados:', data);
  };

  return (
    <LayoutBase title='Perfil'>
      <div className='flex flex-col items-center justify-center min-h-screen bg-background px-4 py-8'>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full max-w-2xl space-y-12'
          >
            <section className='space-y-6'>
              <h2 className='text-2xl font-bold'>Informações do Perfil</h2>

              <ImageField
                control={control}
                name='avatar'
                label='Foto de perfil'
              />

              <InputField
                control={control}
                name='name'
                label='Nome'
                placeholder='Seu nome completo'
              />

              <InputField
                control={control}
                name='email'
                label='Email'
                placeholder='seu@email.com'
                type='email'
              />

              <Button type='submit'>Salvar Dados</Button>
            </section>

            <section className='space-y-6'>
              <h2 className='text-2xl font-bold'>Alterar Senha</h2>

              <InputField
                control={control}
                name='currentPassword'
                label='Senha atual'
                type='password'
                placeholder='Senha atual'
              />
              <InputField
                control={control}
                name='newPassword'
                label='Nova senha'
                type='password'
                placeholder='Nova senha'
              />
              <InputField
                control={control}
                name='confirmPassword'
                label='Confirmar nova senha'
                type='password'
                placeholder='Confirmar nova senha'
              />

              <Button type='submit'>Atualizar Senha</Button>
            </section>
          </form>
        </Form>
      </div>
    </LayoutBase>
  );
}
