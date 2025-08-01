import { useState } from 'react';
import { useResponsiveLayout } from '@/shared/hooks/use-responsive-layout';
import { LoginForm } from '../components/login-form';
import { SignupForm } from '../components/signup-form';
import { AuthCardContainer } from '../components/auth-card-container';
import { AuthBackground } from '../components/auth-background';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { isDesktop } = useResponsiveLayout();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background py-20 px-4">
      <AuthBackground />

      {isDesktop ? (
        <div className="flex gap-10 items-start">
          <div className="w-96">
            <h2 className="text-xl font-bold mb-4">Sign In</h2>
            <LoginForm onSuccess={() => {}} />
          </div>
          <div className="w-96">
            <h2 className="text-xl font-bold mb-4">Create Account</h2>
            <SignupForm onSuccess={() => {}} />
          </div>
        </div>
      ) : (
        <AuthCardContainer mode={mode} onModeChange={setMode}>
          {mode === 'login' ? (
            <LoginForm onSuccess={() => {}} className="w-80" />
          ) : (
            <SignupForm onSuccess={() => setMode('login')} className="w-80" />
          )}
        </AuthCardContainer>
      )}
    </div>
  );
};