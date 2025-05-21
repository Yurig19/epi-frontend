import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Skeleton } from './components/ui/skeleton';
import { useAuth } from './contexts/authContexts';

// AUTH ROUTES
const LoginPage = lazy(() => import('./pages/login'));

// SYSTEM ROUTES
const DashboardPage = lazy(() => import('./pages/dashboard'));

const PpeFormsManagementPage = lazy(() => import('./pages/ppeFormsManagement'));
const CreateEditViewPpeFormsPage = lazy(
  () => import('./pages/ppeFormsManagement/createEditView')
);

const PpeManagementsPage = lazy(() => import('./pages/ppeManagements'));

const EmployeesManagementsPage = lazy(
  () => import('./pages/employeesManagements')
);

const DepartmentsManagementsPage = lazy(
  () => import('./pages/departmentsManagement')
);
const AuditsPage = lazy(() => import('./pages/audits'));
const LogsPage = lazy(() => import('./pages/errorLogs'));

const ProfilePage = lazy(() => import('./pages/profile'));

const SkeletonLoader = () => (
  <div className='flex flex-col space-y-4 items-center justify-center h-screen'>
    <Skeleton className='h-6 w-48' />
    <Skeleton className='h-4 w-64' />
    <Skeleton className='h-4 w-40' />
  </div>
);

const authRoutes = [
  {
    path: '/',
    element: <LoginPage />,
  },
];

const systemRoutes = [
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/ppeFormsManagements',
    element: <PpeFormsManagementPage />,
  },
  {
    path: '/ppeFormsManagement/create',
    element: <CreateEditViewPpeFormsPage />,
  },
  {
    path: '/ppeFormsManagement/edit/:uuid',
    element: <CreateEditViewPpeFormsPage />,
  },
  {
    path: '/ppeFormsManagement/view/:uuid',
    element: <CreateEditViewPpeFormsPage />,
  },
  {
    path: '/ppeManagements',
    element: <PpeManagementsPage />,
  },
  {
    path: '/employeesManagements',
    element: <EmployeesManagementsPage />,
  },
  {
    path: '/departments',
    element: <DepartmentsManagementsPage />,
  },
  {
    path: '/audits',
    element: <AuditsPage />,
  },
  {
    path: '/logs',
    element: <LogsPage />,
  },
];

export function ProjectRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SkeletonLoader />;
  }
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Routes>
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {user &&
          user.role === 'admin' &&
          systemRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
      </Routes>
    </Suspense>
  );
}
