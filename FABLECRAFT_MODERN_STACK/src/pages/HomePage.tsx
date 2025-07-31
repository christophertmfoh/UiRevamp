import { LandingPage } from '@/features-modern/landing/landing-page';
import { ThemeProvider } from '@/app/providers/theme-provider';

export function HomePage() {
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
      disableTransitionOnChange
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
      <div className='min-h-screen bg-background'>
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
