import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';

import { ThemeProvider } from './components/theme-provider';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import type { Project } from './lib/types';
import { LandingPage } from './components/LandingPage';
import { ProjectsPage } from './components/projects/ProjectsPage';
import { ProjectDashboard } from './components/project/ProjectDashboard';
import { ProjectCreationWizard } from './components/project/ProjectCreationWizard';
import { ProjectModal, ConfirmDeleteModal, ImportManuscriptModal, IntelligentImportModal } from './components/Modals';
import { AuthPageRedesign } from './pages/AuthPageRedesign';
import { FloatingOrbs } from './components/FloatingOrbs';

// Force scrollbar styling with JavaScript - comprehensive approach
const applyScrollbarStyles = () => {
  // Remove any existing styles first
  const existingStyles = document.querySelectorAll('style[data-scrollbar]');
  existingStyles.forEach(el => el.remove());
  
  // Create comprehensive style override
  const style = document.createElement('style');
  style.setAttribute('data-scrollbar', 'true');
  
  // Multi-approach CSS that covers all browsers and scenarios
  style.textContent = `
    /* Chromium-based browsers - Document level */
    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    ::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: transparent !important;
    }
    
    html::-webkit-scrollbar-track,
    body::-webkit-scrollbar-track,
    ::-webkit-scrollbar-track {
      background: transparent !important;
    }
    
    html::-webkit-scrollbar-thumb,
    body::-webkit-scrollbar-thumb,
    ::-webkit-scrollbar-thumb {
      background: #a0967d !important;
      border-radius: 6px !important;
      border: none !important;
    }
    
    html::-webkit-scrollbar-thumb:hover,
    body::-webkit-scrollbar-thumb:hover,
    ::-webkit-scrollbar-thumb:hover {
      background: #8b8269 !important;
    }
    
    html::-webkit-scrollbar-corner,
    body::-webkit-scrollbar-corner,
    ::-webkit-scrollbar-corner {
      background: transparent !important;
    }
    
    /* Firefox */
    html, body {
      scrollbar-width: thin !important;
      scrollbar-color: #a0967d transparent !important;
    }
    
    /* All other elements */
    *:not(html):not(body) {
      scrollbar-width: thin !important;
      scrollbar-color: #a0967d transparent !important;
    }
    
    *:not(html):not(body)::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: transparent !important;
    }
    
    *:not(html):not(body)::-webkit-scrollbar-track {
      background: transparent !important;
    }
    
    *:not(html):not(body)::-webkit-scrollbar-thumb {
      background: #a0967d !important;
      border-radius: 6px !important;
    }
    
    *:not(html):not(body)::-webkit-scrollbar-thumb:hover {
      background: #8b8269 !important;
    }
  `;
  
  // Insert at beginning of head for maximum priority
  document.head.insertBefore(style, document.head.firstChild);
  
  // Also try direct DOM manipulation for the main scrollbar
  if (document.documentElement) {
    document.documentElement.style.setProperty('scrollbar-width', 'thin', 'important');
    document.documentElement.style.setProperty('scrollbar-color', '#a0967d transparent', 'important');
  }
  
  if (document.body) {
    document.body.style.setProperty('scrollbar-width', 'thin', 'important');
    document.body.style.setProperty('scrollbar-color', '#a0967d transparent', 'important');
  }
  
  // Remove any existing scrollbar styles
  const existingScrollbarStyles = document.querySelectorAll('style[data-scrollbar]');
  existingScrollbarStyles.forEach(el => el.remove());
  
  style.setAttribute('data-scrollbar', 'true');
  document.head.appendChild(style);
};

type View = 'landing' | 'auth' | 'projects' | 'dashboard';
type ModalType = 'new' | 'edit' | 'rename' | 'delete' | 'goals' | 'tasks' | 'importManuscript' | 'import' | null;

interface Modal {
  type: ModalType;
  project: Project | null;
}

export default function App() {
  const { user, isAuthenticated, isLoading, login, logout, checkAuth } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modal, setModal] = useState<Modal>({ type: null, project: null });
  const [guideMode, setGuideMode] = useState(false);

  // Initialize auth check
  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize scrollbar styling
  useEffect(() => {
    applyScrollbarStyles();
    
    const timer = setTimeout(() => {
      applyScrollbarStyles();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Project creation handler with proper refresh
  const handleProjectCreated = async (projectData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          userId: user?.id || '',
          name: projectData.name,
          type: projectData.type,
          description: projectData.description || '',
          genre: projectData.genres || [],
          manuscriptNovel: '',
          manuscriptScreenplay: '',
          synopsis: projectData.synopsis || ''
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        
        // Add to projects list immediately for instant feedback
        setProjects(prev => [...prev, newProject]);
        
        // Set as active project and navigate
        setActiveProject(newProject);
        setView('dashboard');
        setModal({ type: null, project: null });
        
        // Refresh projects list to ensure sync with server
        await fetchProjects();
      }
    } catch (error) {
      console.error('Project creation failed:', error);
      throw error; // Re-throw so wizard can handle the error
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`/api/projects/${updatedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        const updated = await response.json();
        if (activeProject?.id === updated.id) {
          setActiveProject(updated);
        }
        setModal({ type: null, project: null });
      }
    } catch (error) {
      console.error('Project update failed:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        if (activeProject?.id === projectId) {
          setActiveProject(null);
          setView('projects');
        }
        setModal({ type: null, project: null });
      }
    } catch (error) {
      console.error('Project deletion failed:', error);
    }
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setView('dashboard');
  };

  const handleAuth = async (userData: { username: string; token: string }) => {
    try {
      await login(userData.username, userData.token);
      setView('landing');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setView('landing');
    setActiveProject(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem
        themes={[
          'light', 
          'dark',
          'system',
          'arctic-focus',
          'golden-hour',
          'midnight-ink',
          'forest-manuscript',
          'starlit-prose',
          'coffee-house'
        ]}
      >
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const renderView = () => {
    switch(view) {
      case 'landing':
        return (
          <LandingPage 
            onNavigate={setView}
            onNewProject={() => setModal({ type: 'new', project: null })}
            onAuth={() => setView('auth')}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
          />
        );
      case 'projects':
        return (
          <ProjectsPage
            onNavigate={setView}
            onNewProject={() => setModal({ type: 'new', project: null })}
            onSelectProject={handleSelectProject}
            onLogout={handleLogout}
            user={user}
          />
        );
      case 'dashboard':
        // Create a test project for dashboard testing
        const testProject = {
          id: 'test-123',
          name: 'Test Project',
          type: 'novel',
          description: 'A test project for debugging',
          genre: ['fantasy'],
          manuscript: { novel: '', screenplay: '' },
          synopsis: 'Test synopsis',
          characters: [],
          locations: [],
          worldBuilding: { cultures: [], languages: [], religions: [] },
          plotOutline: { acts: [], scenes: [] },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Project;
        
        return (
          <ProjectDashboard
            project={testProject}
            onBack={() => setView('projects')}
            onUpdateProject={handleUpdateProject}
            onOpenModal={(modalInfo) => setModal(modalInfo)}
            onLogout={handleLogout}
            user={user}
            isAuthenticated={isAuthenticated}
            guideMode={guideMode}
            setGuideMode={setGuideMode}
          />
        );
      case 'auth':
        return (
          <AuthPageRedesign 
            onAuth={handleAuth}
            onBack={() => setView('landing')}
          />
        );
      default:
        // Simple test interface for other views
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">FableCraft</h1>
              <p className="text-muted-foreground mb-4">Current view: {view}</p>
              <p className="text-sm text-muted-foreground">User: {user?.username || 'Not logged in'}</p>
              <p className="text-sm text-muted-foreground">Auth: {isAuthenticated ? 'Yes' : 'No'}</p>
              <button 
                onClick={() => setView('landing')} 
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded mr-2"
              >
                Go to Landing
              </button>
                             <button 
                 onClick={() => setView('projects')} 
                 className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded mr-2"
               >
                 Go to Projects
               </button>
               <button 
                 onClick={() => setView('dashboard')} 
                 className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded mr-2"
               >
                 Test Dashboard
               </button>
               <button 
                 onClick={() => setModal({ type: 'new', project: null })} 
                 className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded"
               >
                 Test Modal
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem
        themes={[
          'light', 
          'dark',
          'system',
          'arctic-focus',
          'golden-hour',
          'midnight-ink',
          'forest-manuscript',
          'starlit-prose',
          'coffee-house'
        ]}
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <TooltipProvider>
              <div className={`min-h-screen bg-background text-foreground ${guideMode ? 'guide-mode' : ''}`}>
                <FloatingOrbs />
        
                {renderView()}
          
                {/* All Modals */}
                {modal.type === 'new' && (
                  <ProjectCreationWizard 
                    isOpen={true}
                    onClose={() => setModal({ type: null, project: null })} 
                    onCreate={handleProjectCreated}
                  />
                )}
                {modal.type === 'edit' && modal.project && (
                  <ProjectModal 
                    projectToEdit={modal.project} 
                    onClose={() => setModal({ type: null, project: null })} 
                  />
                )}
                {modal.type === 'rename' && modal.project && (
                  <ProjectModal 
                    projectToEdit={modal.project} 
                    isRenameOnly={true} 
                    onClose={() => setModal({ type: null, project: null })} 
                  />
                )}
                {modal.type === 'delete' && modal.project && (
                  <ConfirmDeleteModal 
                    project={modal.project} 
                    onClose={() => setModal({ type: null, project: null })} 
                    onDelete={handleDeleteProject} 
                  />
                )}
                {modal.type === 'importManuscript' && (
                  <ImportManuscriptModal 
                    projectToUpdate={modal.project} 
                    onClose={() => setModal({ type: null, project: null })} 
                    onUpdateProject={handleUpdateProject} 
                    onCreateProject={handleProjectCreated} 
                  />
                )}
                {modal.type === 'import' && (
                  <IntelligentImportModal
                    onProjectCreated={handleProjectCreated}
                    onClose={() => setModal({ type: null, project: null })}
                  />
                )}
              </div>
            </TooltipProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}