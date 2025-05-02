import { BrowserRouter } from 'react-router-dom';
import { ProjectRoutes } from './routes';
import { AuthProvider } from './contexts/authContexts';
import { ThemeProvider } from './contexts/themeContext';
import { Toaster } from './components/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <ProjectRoutes />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
