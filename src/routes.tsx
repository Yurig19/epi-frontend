import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Skeleton } from './components/ui/skeleton';
import { useAuth } from './contexts/authContexts';

// AUTH
const LoginPage = lazy(() => import('./pages/login'));

const DashboardPage = lazy(() => import('./pages/dashboard'));
const EpiManagementPage = lazy(() => import('./pages/epiManagement'));

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
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/epi-management',
    element: <EpiManagementPage />,
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
        {!user &&
          authRoutes.map(({ path, element }) => (
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
