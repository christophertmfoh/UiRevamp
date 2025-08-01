import { useState } from 'react';
import { LoginForm } from '../components/login-form';
import { SignupForm } from '../components/signup-form';
import { AuthCardContainer } from '../components/auth-card-container';
import { AuthBackground } from '../components/auth-background';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background py-20">
      <AuthBackground />

      <AuthCardContainer mode={mode} onModeChange={setMode}>
        {mode === 'login' ? (
          <LoginForm onSuccess={() => {}} className="w-80" />
        ) : (
          <SignupForm onSuccess={() => setMode('login')} className="w-80" />
        )}
      </AuthCardContainer>
    </div>
  );
};