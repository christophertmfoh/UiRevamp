import { LandingPage } from '@/features-modern/landing/landing-page';

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
    <LandingPage
      onNavigate={handleNavigate}
      onNewProject={handleNewProject}
      onAuth={handleAuth}
      onLogout={handleLogout}
      user={null}
      isAuthenticated={false}
    />
  );
}
