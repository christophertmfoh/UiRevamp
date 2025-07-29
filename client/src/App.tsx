import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
// Performance monitoring integrated - webVitals available in utils

import { ThemeProvider } from './components/theme-provider';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PerformanceDashboard } from './components/dev/PerformanceDashboard';
// import { backupManager } from './lib/backup/replitBackup'; // Disabled to save memory
import { useAuth } from './hooks/useAuth';
import type { Project } from './lib/types';
import { LandingPage } from './pages/landing';
import { ProjectWorkspace } from './components/projects/ProjectWorkspace';
import { ProjectDashboard } from './components/project/ProjectDashboard';
import { ProjectCreationWizard } from './components/project/ProjectCreationWizard';
import { ProjectModal, ConfirmDeleteModal, ImportManuscriptModal, IntelligentImportModal } from './components/Modals';
import { AuthPageRedesign } from './pages/AuthPageRedesign';
import { FloatingOrbs } from './components/FloatingOrbs';
import { TestAIModules } from './components/character/TestAIModules';

// Initialize ResizeObserver fix before any components mount
import { initializeResizeObserverFix } from './utils/resizeObserverFix';
if (typeof window !== 'undefined') {
  initializeResizeObserverFix();
}

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modal, setModal] = useState<Modal>({ type: null, project: null });
  const [guideMode, setGuideMode] = useState(false);

  // ALL USEEFFECT HOOKS MUST BE AT THE TOP - BEFORE ANY EARLY RETURNS
  
  // Initialize app state and URL restoration
  useEffect(() => {
    console.log('🚀 App initialized');
    
    // Check for test mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'ai') {
      console.log('🧪 Test mode detected in URL, navigating to test-ai');
      setView('test-ai');
      return;
    }
    
    // Apply scrollbar styles when component mounts
    applyScrollbarStyles();
    
    // Restore view from URL on app load
    const path = window.location.pathname;
    if (path === '/projects') setView('projects');
    else if (path === '/dashboard') setView('dashboard');
    else if (path === '/auth') setView('auth');
    else setView('landing');
    
    const initializeAuth = async () => {
      // Check if we have stored user data and token
      const storedUser = localStorage.getItem('fablecraft_user');
      const storedToken = localStorage.getItem('fablecraft_token');
      
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          // Restore auth state directly without API call for better UX
          login(user, storedToken);
          
          // Optional: Verify token is still valid with server
          await checkAuth();
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          // Clear invalid stored data
          localStorage.removeItem('fablecraft_user');
          localStorage.removeItem('fablecraft_token');
          localStorage.removeItem('token');
        }
      } else {
        // No stored auth, just check current state
        await checkAuth();
      }
    };
    
    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize projects when authenticated
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!isAuthenticated || !user) return;
        
        // Get token from Zustand store first, fallback to localStorage
        const token = useAuth.getState().token || localStorage.getItem('fablecraft_token') || localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const projectsData = await response.json();
          // Server now filters by user ID, so we can trust the response
          setProjects(projectsData);
          console.log(`📊 Loaded ${projectsData.length} projects for user: ${user.username}`);
        } else {
          // Don't log errors for expected 401/403 responses
          if (response.status !== 401 && response.status !== 403) {
            console.warn('Projects fetch failed:', response.status);
          }
        }
      } catch (error) {
        // Only log actual network errors, not auth failures
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn('Projects fetch error:', error.message);
        }
      }
    };

    if (isAuthenticated && user) {
      fetchProjects();
    }
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize scrollbar styling
  useEffect(() => {
    applyScrollbarStyles();
    
    const timer = setTimeout(() => {
      applyScrollbarStyles();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle browser back/forward buttons and refresh
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      let newView: View = 'landing';
      
      if (path === '/projects') newView = 'projects';
      else if (path === '/dashboard') newView = 'dashboard';
      else if (path === '/auth') newView = 'auth';
      
      // Only scroll to top for actual navigation, not initial load
      if (view !== newView) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      setView(newView);
    };

    // Listen for back/forward button clicks
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [view]);

  // Project restoration on dashboard refresh - ALWAYS called
  useEffect(() => {
    if (view === 'dashboard' && !activeProject && projects.length > 0) {
      // Try to restore project from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('project') || localStorage.getItem('activeProjectId');
      
      if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setActiveProject(project);
        } else {
          // Project not found, redirect to projects
          setView('projects');
        }
      } else {
        // No project specified, redirect to projects
        setView('projects');
      }
    }
  }, [view, activeProject, projects]);

  // Save active project ID to localStorage for restoration
  useEffect(() => {
    if (activeProject) {
      localStorage.setItem('activeProjectId', activeProject.id);
      // Also update URL with project ID for bookmarking
      if (view === 'dashboard') {
        const url = new URL(window.location.href);
        url.searchParams.set('project', activeProject.id);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [activeProject, view]);

  // Phase 3: Initialize auto-backup system for creative workflow (DISABLED FOR MEMORY)
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     const cleanup = backupManager.scheduleAutoBackups();
  //     console.log('💾 Auto-backup system initialized (every 10 minutes)');
  //     
  //     return cleanup; // Cleanup function to clear interval
  //   }
  // }, []);

  // Fetch projects function with proper error handling and user filtering
  const fetchProjects = async () => {
    try {
      if (!isAuthenticated || !user) return;
      
      // Get token from Zustand store first, fallback to localStorage
      const token = useAuth.getState().token || localStorage.getItem('fablecraft_token') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const projectsData = await response.json();
        // Server now filters by user ID, so we can trust the response
        setProjects(projectsData);
        console.log(`📊 Loaded ${projectsData.length} projects for user: ${user.username}`);
      } else {
        // Don't log errors for expected 401/403 responses
        if (response.status !== 401 && response.status !== 403) {
          console.warn('Projects fetch failed:', response.status);
        }
      }
    } catch (error) {
      // Only log actual network errors, not auth failures
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn('Projects fetch error:', error.message);
      }
    }
  };

  // Removed duplicate useEffect - already defined at top of component

  // Project creation handler with proper refresh
  const handleProjectCreated = async (projectData: any) => {
    try {
      // Get token from Zustand store (more reliable than localStorage)
      const token = useAuth.getState().token || localStorage.getItem('fablecraft_token');
      if (!token) {
        // If no token, redirect to auth
        setView('auth');  // Use setView directly to avoid circular dependency
        throw new Error('Please log in to create projects');
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
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
        console.log(`✅ Project created successfully: "${newProject.name}" (${newProject.type})`);
        
        // Immediately add the new project to the list for instant UI feedback
        setProjects(prev => {
          // Check if project already exists to avoid duplicates
          const exists = prev.find(p => p.id === newProject.id);
          return exists ? prev : [...prev, newProject];
        });
        
        // Also trigger a background refresh to ensure data consistency
        setTimeout(async () => {
          try {
            const refreshedProjects = await fetch('/api/projects', {
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json());
            
            // Server now filters by user ID, so we can trust the response
            setProjects(refreshedProjects);
          } catch (error) {
            console.warn('Background refresh failed:', error);
          }
        }, 500);
        
        // Set the newly created project as active and navigate
        setActiveProject(newProject);
        setView('dashboard');  // Use setView directly to avoid circular dependency
        setModal({ type: null, project: null });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Project creation failed:', error instanceof Error ? error.message : error);
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
      console.error('Project update failed:', error instanceof Error ? error.message : error);
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
          setView('projects');  // Use setView directly to avoid circular dependency
        }
        setModal({ type: null, project: null });
      }
    } catch (error) {
      console.error('Project deletion failed:', error instanceof Error ? error.message : error);
    }
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    // Keep the user in ProjectWorkspace instead of switching to old ProjectDashboard
    // The ProjectWorkspace handles project selection internally with tabs
  };

  const handleAuth = async (userData: { username: string; token: string }) => {
    try {
      // Get the full user data from localStorage (stored by AuthPageRedesign)
      const storedUser = localStorage.getItem('fablecraft_user');
      const fullUser = storedUser ? JSON.parse(storedUser) : null;
      
      if (fullUser) {
        // Use the complete user object from the API response
        const user = {
          id: fullUser.id,
          email: fullUser.email,
          username: fullUser.username,
          fullName: fullUser.fullName || fullUser.username,
          createdAt: fullUser.createdAt,
          updatedAt: fullUser.updatedAt,
          lastLoginAt: fullUser.lastLoginAt,
          isActive: fullUser.isActive
        };
        
        // Store token with both keys for compatibility
        localStorage.setItem('token', userData.token);
        localStorage.setItem('fablecraft_token', userData.token);
        
        // Call Zustand login method to update auth state
        login(user, userData.token);
        setView('projects'); // Go directly to projects after login
      } else {
        console.error('No user data found in storage');
      }
    } catch (error) {
      console.error('Authentication failed:', error instanceof Error ? error.message : error);
    }
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

  // Navigation handler with URL sync and scroll-to-top
  const navigateToView = (newView: View | string) => {
    const viewName = newView as View;
    
    // Update URL without page reload
    const paths: Record<View, string> = {
      'landing': '/',
      'projects': '/projects', 
      'dashboard': '/dashboard',
      'auth': '/auth'
    };
    
    window.history.pushState({}, '', paths[viewName] || '/');
    
    // Scroll to top of page smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update view state
    setView(viewName);
  };

  // REMOVED DUPLICATE useEffect hooks - they are already defined at the top of the component

  // Logout handler that returns Promise
  const handleLogout = async () => {
    await logout();
    setView('landing');
    setActiveProject(null);
    setProjects([]);
  };

  // Modal handler to fix type mismatch
  const handleOpenModal = (modalInfo: { type: string | null; project: Project | null }) => {
    setModal({
      type: modalInfo.type as ModalType,
      project: modalInfo.project
    });
  };

  const renderView = () => {
    switch(view) {
      case 'landing':
        return (
          <LandingPage 
            onNavigate={navigateToView}
            onNewProject={() => setModal({ type: 'new', project: null })}
            onAuth={() => navigateToView('auth')}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
            onUploadManuscript={() => setModal({ type: 'import', project: null })}
            guideMode={guideMode}
            setGuideMode={setGuideMode}
          />
        );
      case 'projects':
        return (
          <ProjectWorkspace
            onNavigate={navigateToView}
            onNewProject={() => setModal({ type: 'new', project: null })}
            onSelectProject={handleSelectProject}
            onLogout={handleLogout}
            user={user}
            selectedProject={activeProject}
            projects={(projects || []).map(p => ({
              ...p,
              description: p.description ?? null,
              synopsis: p.synopsis ?? null,
              genre: p.genre ?? [],
              manuscriptNovel: p.manuscriptNovel ?? null,
              manuscriptScreenplay: p.manuscriptScreenplay ?? null
            }))}
            isLoading={!isAuthenticated || isLoading}
          />
        );
      case 'dashboard':
        if (!activeProject) {
          // If no active project, redirect to projects
          setView('projects');
          return null;
        }
        
        return (
          <ProjectDashboard
            project={activeProject}
            onBack={() => navigateToView('projects')}
            onUpdateProject={handleUpdateProject}
            onOpenModal={handleOpenModal}
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
            onBack={() => navigateToView('landing')}
          />
        );
      case 'test-ai':
        return <TestAIModules />;
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
                onClick={() => navigateToView('landing')} 
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded mr-2"
              >
                Go to Landing
              </button>
                             <button 
                 onClick={() => navigateToView('projects')} 
                 className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded mr-2"
               >
                 Go to Projects
               </button>
               <button 
                 onClick={() => navigateToView('test-ai')} 
                 className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded"
               >
                 🧪 Test AI Modules
               </button>
               <button 
                 onClick={() => navigateToView('dashboard')} 
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
        
        {/* Replit-Optimized Performance Dashboard (Development Only) */}
        {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
      </ThemeProvider>
    </ErrorBoundary>
  );
}