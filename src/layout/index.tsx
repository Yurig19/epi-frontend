import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Fragment } from 'react/jsx-runtime';
import Header from './header';
import SidebarApp from './sidebar';

interface BreadcrumbItemProps {
  label: string;
  route?: string;
}
interface LayoutProps {
  title: string;
  children: React.ReactNode;
  breadCrumbItems?: BreadcrumbItemProps[];
}

const LayoutBase = ({
  children,
  title,
  breadCrumbItems = [{ label: 'Dashboard', route: '/dashboard' }],
}: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-background text-foreground'>
        <SidebarApp />

        <div className='flex flex-1 flex-col'>
          <Header />
          <SidebarTrigger />
          <div className='p-7'>
            <div className='mb-4'>
              <div className='flex flex-col gap-2 px-4'>
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadCrumbItems.map((item) => (
                      <Fragment key={item.route}>
                        <BreadcrumbItem>
                          {item.route ? (
                            <BreadcrumbLink
                              href={item.route}
                              className='hover:text-primary transition-colors'
                            >
                              {item.label}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </Fragment>
                    ))}

                    <BreadcrumbItem>
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div>
                  <h1 className='text-2xl font-bold text-muted-foreground'>
                    {title}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <main className='flex flex-1 bg-background'>
            <div className='p-5 text-muted-foreground overflow-auto w-full'>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LayoutBase;
