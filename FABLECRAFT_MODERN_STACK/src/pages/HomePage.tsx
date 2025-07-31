import { LandingPage } from '@/features-modern/landing/landing-page';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { useEffect } from 'react';

export function HomePage() {
  // Debug theme application on mount
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.debug('HomePage: Initial theme attribute:', document.documentElement.getAttribute('data-theme'));
      console.debug('Build mode:', import.meta.env.VITE_BUILD_MODE);
      console.debug('Environment:', process.env.NODE_ENV);
    }
  }, []);

  // Mock handlers for landing page functionality
  const handleNavigate = (_view: string) => {
    // TODO: Implement navigation logic
  };

  const handleNewProject = () => {
    // TODO: Implement new project creation
  };

  const handleAuth = () => {
    // TODO: Implement authentication
  };

  const handleLogout = async () => {
    // TODO: Implement logout logic
  };

  return (
    <ThemeProvider
      attribute='data-theme'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange={false}
      storageKey='fablecraft-theme'
      themes={[
        'light',
        'arctic-focus',
        'golden-hour',
        'dark',
        'midnight-ink',
        'forest-manuscript',
        'starlit-prose',
        'coffee-house',
        'system',
      ]}
    >
      <div className='min-h-screen bg-background transition-colors duration-200'>
        {/* Development indicator */}
        {(process.env.NODE_ENV !== 'production' || import.meta.env.VITE_ENABLE_DEBUG === 'true') && (
          <div className='fixed top-0 left-0 z-50 bg-yellow-500 text-black px-2 py-1 text-xs font-mono'>
            {import.meta.env.VITE_BUILD_MODE || process.env.NODE_ENV} | Debug Mode
          </div>
        )}
        
        <LandingPage
          onNavigate={handleNavigate}
          onNewProject={handleNewProject}
          onAuth={handleAuth}
          onLogout={handleLogout}
          user={null}
          isAuthenticated={false}
        />
      </div>
    </ThemeProvider>
  );
}
