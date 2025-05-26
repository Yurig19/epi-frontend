import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LayoutBase } from '@/layout';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ImageField } from '@/components/fields/image';
import { InputField } from '@/components/fields/input';
import { useAuth } from '@/contexts/authContexts';
import { useUpdatePasswordUser } from '@/hooks/user/use-update-password-user';
import { useUpdateUser } from '@/hooks/user/use-update-user';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  avatar: z.any().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual obrigatória'),
    newPassword: z
      .string()
      .min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      avatar: '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate: updatePassword } = useUpdatePasswordUser();
  const { mutate: updateUser } = useUpdateUser();

  const onSubmitProfile = (data: ProfileForm) => {
    updateUser({
      email: data.email,
      name: data.name,
    });
  };

  const onSubmitPassword = (data: PasswordForm) => {
    updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <LayoutBase title='Perfil'>
      <div className='flex flex-col items-center justify-center min-h-screen bg-background px-4 py-8 space-y-12'>
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            className='w-full max-w-2xl space-y-6'
          >
            <h2 className='text-2xl font-bold'>Informações do Perfil</h2>

            <ImageField
              control={profileForm.control}
              name='avatar'
              label='Foto de perfil'
            />

            <InputField
              control={profileForm.control}
              name='name'
              label='Nome'
              placeholder='Seu nome completo'
            />

            <InputField
              control={profileForm.control}
              name='email'
              label='Email'
              placeholder='seu@email.com'
              type='email'
            />

            <Button type='submit'>Salvar Dados</Button>
          </form>
        </Form>

        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className='w-full max-w-2xl space-y-6'
          >
            <h2 className='text-2xl font-bold'>Alterar Senha</h2>

            <InputField
              control={passwordForm.control}
              name='currentPassword'
              label='Senha atual'
              type='password'
              placeholder='Senha atual'
            />
            <InputField
              control={passwordForm.control}
              name='newPassword'
              label='Nova senha'
              type='password'
              placeholder='Nova senha'
            />
            <InputField
              control={passwordForm.control}
              name='confirmPassword'
              label='Confirmar nova senha'
              type='password'
              placeholder='Confirmar nova senha'
            />

            <Button type='submit'>Atualizar Senha</Button>
          </form>
        </Form>
      </div>
    </LayoutBase>
  );
}
