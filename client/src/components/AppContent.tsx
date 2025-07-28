import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToastActions } from './ui/Toast';
import type { Project } from '../lib/types';
import { LandingPage } from './LandingPage';
import { createLazyRoute } from './projects/LazyProjectComponents';
import { ProjectModal, ConfirmDeleteModal, ImportManuscriptModal, IntelligentImportModal } from './Modals';
import { AuthPageRedesign } from '../pages/AuthPageRedesign';
import { ProjectCreationWizard } from './project/ProjectCreationWizard';
import { FloatingOrbs } from './FloatingOrbs';

// Create lazy-loaded routes
const LazyProjectsPage = createLazyRoute(() => 
  import('./projects/ProjectsPage').then(module => ({ 
    default: module.ProjectsPage 
  }))
);

const LazyProjectDashboard = createLazyRoute(() => 
  import('./project').then(module => ({ 
    default: module.ProjectDashboard 
  }))
);

type View = 'landing' | 'auth' | 'projects' | 'dashboard';
type ModalType = 'new' | 'edit' | 'rename' | 'delete' | 'goals' | 'tasks' | 'importManuscript' | 'import' | null;

interface Modal {
  type: ModalType;
  project: Project | null;
}

export function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const toast = useToastActions();
  
  const [view, setView] = useState<View>('landing');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modal, setModal] = useState<Modal>({ type: null, project: null });
  const [guideMode, setGuideMode] = useState(false);

  // Enhanced project handlers with toast notifications
  const handleProjectCreated = async (projectData: any) => {
    try {
      await toast.promise(
        (async () => {
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

          if (!response.ok) throw new Error('Failed to create project');
          
          const newProject = await response.json();
          
          // Fetch the full project data
          const fullProjectResponse = await fetch(`/api/projects/${newProject.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (fullProjectResponse.ok) {
            const fullProject = await fullProjectResponse.json();
            setActiveProject(fullProject);
            setView('dashboard');
            setModal({ type: null, project: null });
            return fullProject;
          }
          
          return newProject;
        })(),
        {
          loading: 'Creating your project...',
          success: (project) => `📝 "${project.name}" created successfully!`,
          error: 'Failed to create project. Please try again.'
        }
      );
    } catch (error) {
      console.error('Project creation failed:', error);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      await toast.promise(
        (async () => {
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

          if (!response.ok) throw new Error('Failed to update project');
          
          const updated = await response.json();
          
          if (activeProject?.id === updated.id) {
            setActiveProject(updated);
          }
          
          setModal({ type: null, project: null });
          return updated;
        })(),
        {
          loading: 'Updating project...',
          success: (project) => `✏️ "${project.name}" updated successfully!`,
          error: 'Failed to update project. Please try again.'
        }
      );
    } catch (error) {
      console.error('Project update failed:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await toast.promise(
        (async () => {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token');

          const response = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!response.ok) throw new Error('Failed to delete project');
          
          if (activeProject?.id === projectId) {
            setActiveProject(null);
            setView('projects');
          }
          
          setModal({ type: null, project: null });
          return { id: projectId };
        })(),
        {
          loading: 'Deleting project...',
          success: '🗑️ Project deleted successfully',
          error: 'Failed to delete project. Please try again.'
        }
      );
    } catch (error) {
      console.error('Project deletion failed:', error);
    }
  };

  const handleCreateProjectFromManuscript = async (manuscript: any) => {
    try {
      await toast.promise(
        handleProjectCreated(manuscript),
        {
          loading: 'Importing manuscript...',
          success: '📄 Manuscript imported successfully!',
          error: 'Failed to import manuscript. Please try again.'
        }
      );
    } catch (error) {
      console.error('Manuscript import failed:', error);
    }
  };

  const handleAuth = async (userData: { username: string; token: string }) => {
    try {
      await toast.promise(
        login(userData.username, userData.token),
        {
          loading: 'Signing you in...',
          success: `👋 Welcome back, ${userData.username}!`,
          error: 'Sign in failed. Please try again.'
        }
      );
      setView('landing');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setView('landing');
    setActiveProject(null);
    toast.info('👋 You have been signed out');
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setView('dashboard');
    toast.success(`📖 Opened "${project.name}"`);
  };

  const renderView = () => {
    switch(view) {
      case 'auth':
        return (
          <AuthPageRedesign 
            onAuth={handleAuth}
            onBack={() => setView('landing')}
          />
        );
      case 'landing':
        return (
          <LandingPage 
            onNavigate={setView}
            onNewProject={() => setModal({ type: 'new', project: null })}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
          />
        );
      case 'projects':
        return (
          <LazyProjectsPage
            onNavigate={setView}
            onNewProject={() => setModal({ type: 'new', project: null })}
            onSelectProject={handleSelectProject}
            onLogout={handleLogout}
            user={user}
          />
        );
      case 'dashboard':
        if (!activeProject) {
          return null;
        }
        return (
          <LazyProjectDashboard
            project={activeProject}
            onBack={() => { setView('projects'); setActiveProject(null); }}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onOpenGoalsModal={() => setModal({ type: 'goals', project: activeProject })}
            onOpenTasksModal={() => setModal({ type: 'tasks', project: activeProject })}
            guideMode={guideMode}
            setGuideMode={setGuideMode}
          />
        );
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${guideMode ? 'guide-mode' : ''}`}>
      <FloatingOrbs />
      {renderView()}
    
      {/* Modals */}
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
          onCreateProject={handleCreateProjectFromManuscript} 
        />
      )}
      {modal.type === 'import' && (
        <IntelligentImportModal
          onProjectCreated={handleProjectCreated}
          onClose={() => setModal({ type: null, project: null })}
        />
      )}
    </div>
  );
}