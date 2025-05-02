import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/authContexts';
import { Building2, ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarFooterApp from './footer';

type MenuItem = {
  name: string;
  icon?: React.ElementType;
  url?: string;
  subItems?: { name: string; url: string }[];
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    label: 'Dashboard',
    items: [{ name: 'dashboard', icon: Home, url: '/dashboard' }],
  },
  {
    label: 'Gestão de EPIs',
    items: [
      {
        name: 'EPI',
        icon: Building2,
        subItems: [{ name: 'EPI', url: '/epi-management' }],
      },
    ],
  },
];

const SidebarApp = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { state } = useSidebar();

  const isActive = (url?: string) => url && location.pathname.startsWith(url);

  const getDefaultOpenCollapsibles = () => {
    return menuGroups
      .flatMap((group) => group.items)
      .filter((item) => item.subItems?.some((subItem) => isActive(subItem.url)))
      .map((item) => item.name);
  };

  const [openCollapsibles, setOpenCollapsibles] = useState<string[]>(
    getDefaultOpenCollapsibles()
  );
  const isCollapsed = state === 'collapsed';

  const toggleCollapsible = (name: string) => {
    setOpenCollapsibles((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const isItemActive = (item: MenuItem) => {
    if (isActive(item.url)) {
      return true;
    }

    if (item) {
      if (item.subItems) {
        return item.subItems.some((subItem) => isActive(subItem.url));
      }
    }

    return false;
  };

  const renderMenuItems = (menuItems: MenuItem[]) =>
    menuItems.map((item) => (
      <SidebarMenuItem key={item.name}>
        {item.subItems ? (
          isCollapsed ? (
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  className={
                    isItemActive(item)
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  }
                >
                  {item.icon && <item.icon className='mr-2' />}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent side='right'>
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuItem
                      key={subItem.name}
                      onClick={() => navigate(subItem.url)}
                    >
                      <SidebarMenuButton
                        tooltip={subItem.name}
                        className={
                          isActive(subItem.url)
                            ? 'bg-card text-primary-foreground'
                            : ''
                        }
                      >
                        <span>{subItem.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenuSub>
              </PopoverContent>
            </Popover>
          ) : (
            <Collapsible
              open={openCollapsibles.includes(item.name)}
              onOpenChange={() => toggleCollapsible(item.name)}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className={
                    isItemActive(item)
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  }
                >
                  {item.icon && <item.icon className='mr-2' />}
                  {item.name}
                  <ChevronRight className='ml-auto transition-transform duration-200' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuItem
                      key={subItem.name}
                      onClick={() => navigate(subItem.url)}
                    >
                      <SidebarMenuButton
                        tooltip={subItem.name}
                        className={
                          isActive(subItem.url)
                            ? 'bg-sidebar-border text-muted-foreground'
                            : ''
                        }
                      >
                        <span>{subItem.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        ) : (
          <SidebarMenuButton
            onClick={() => item.url && navigate(item.url)}
            className={
              isActive(item.url) ? 'bg-primary text-primary-foreground' : ''
            }
          >
            {item.icon && <item.icon className='mr-2' />}
            <span>{item.name}</span>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    ));

  useEffect(() => {
    const activeMenus = getDefaultOpenCollapsibles();
    setOpenCollapsibles((prev) => [...new Set([...prev, ...activeMenus])]);
  }, [location.pathname]);

  return (
    <Sidebar side='left' collapsible='icon' {...props}>
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(group.items)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterApp
          user={{ name: user?.name || '', email: user?.email || '' }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarApp;
