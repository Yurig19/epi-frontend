import LayoutBase from '@/layout';

export default function DashboardPage() {
  return (
    <LayoutBase title='Dashboard'>
      <div className='flex flex-1 bg-background'>
        <div className='p-5 text-muted-foreground overflow-auto w-full'>
          <h1 className='text-2xl font-bold text-muted-foreground'>
            dashboard page
          </h1>
        </div>
      </div>
    </LayoutBase>
  );
}
