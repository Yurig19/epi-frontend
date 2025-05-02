import avatarImageStandard from '@/assets/avatarImage.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/authContexts';
import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarFooterApp = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <Avatar>
                  <AvatarImage
                    src={user.avatar ?? avatarImageStandard}
                    alt={`avatar do ${user.name ?? 'usuario'}`}
                  />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user.name}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              User Options
            </DropdownMenuLabel>
            <DropdownMenuItem
              className='gap-2 p-2'
              onClick={() => navigate('/admin/profile')}
            >
              <User className='size-4' />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='gap-2 p-2'
              onClick={() => console.log('Go to settings')}
            >
              <Settings className='size-4' />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2' onClick={() => logout()}>
              <LogOut className='size-4' onClick={() => logout()} />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarFooterApp;
