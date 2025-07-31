import { LandingPage } from '@/features-modern/landing/landing-page';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { useEffect } from 'react';

export function HomePage() {
  // Debug theme application on mount
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('HomePage: Initial theme attribute:', document.documentElement.getAttribute('data-theme'));
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
