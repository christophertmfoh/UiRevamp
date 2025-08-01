import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AuthPage } from '@/features-modern/auth/pages/auth-page';
import { ProtectedRoute } from '@/features-modern/auth/components/protected-route';
import { DashboardPage } from '@/features-modern/dashboard/pages/dashboard-page';

function App() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<AuthPage />} />
        
        {/* Protected Routes using React Router v6 composition pattern */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashboardPage />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
// test change
// another test change
// Test lint-staged
