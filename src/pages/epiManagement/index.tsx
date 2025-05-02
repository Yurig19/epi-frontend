import LayoutBase from '@/layout';

export default function EpiManagementPage() {
  return (
    <LayoutBase
      title='Gerenciamento de Epi'
      breadCrumbItems={[{ label: 'Epi', route: '/admin/dashboard' }]}
    >
      <div className='flex flex-1 bg-background'>
        <div className='p-5 text-muted-foreground overflow-auto w-full'>
          <h1 className='text-2xl font-bold text-muted-foreground'>
            Epi Management page
          </h1>
        </div>
      </div>
    </LayoutBase>
  );
}
