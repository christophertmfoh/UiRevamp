import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import type { Project } from './lib/types';
import { LandingPage } from './components/LandingPage';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ProjectModal, ConfirmDeleteModal, ImportManuscriptModal } from './components/Modals';

export default function App() {
  const [view, setView] = useState('landing'); // landing, projects, dashboard
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modal, setModal] = useState<{type: string | null; project: Project | null}>({ type: null, project: null });
  const [guideMode, setGuideMode] = useState(false);

  const handleProjectCreated = (project: Project) => {
    setActiveProject(project);
    setView('dashboard');
    setModal({ type: null, project: null });
  };

  const handleCreateProjectFromManuscript = async (data: any, fileName: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          name: fileName.replace(/\.[^/.]+$/, ''),
          type: 'novel',
          description: 'Imported from manuscript',
          genre: [],
          manuscriptNovel: data.manuscriptText || '',
          manuscriptScreenplay: ''
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        // Fetch the full project data with related entities
        const fullProjectResponse = await fetch(`/api/projects/${newProject.id}`);
        if (fullProjectResponse.ok) {
          const fullProject = await fullProjectResponse.json();
          setActiveProject(fullProject);
          setView('dashboard');
          setModal({ type: null, project: null });
        }
      }
    } catch (error) {
      console.error('Error creating project from manuscript:', error);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const response = await fetch(`/api/projects/${updatedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedProject.name,
          type: updatedProject.type,
          description: updatedProject.description,
          genre: updatedProject.genre,
          manuscriptNovel: updatedProject.manuscript.novel,
          manuscriptScreenplay: updatedProject.manuscript.screenplay
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        if (activeProject && activeProject.id === updatedProject.id) {
          setActiveProject(updatedProject);
        }
        setModal({ type: null, project: null });
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setModal({ type: null, project: null });
        if (activeProject?.id === projectId) {
          setActiveProject(null);
          setView('projects');
        }
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleSelectProject = async (project: Project) => {
    try {
      // Fetch the full project data
      const response = await fetch(`/api/projects/${project.id}`);
      if (response.ok) {
        const fullProject = await response.json();
        setActiveProject(fullProject);
        setView('dashboard');
      }
    } catch (error) {
      console.error('Error selecting project:', error);
    }
  };

  const renderView = () => {
    switch(view) {
      case 'projects':
        return (
          <ProjectsView 
            onSelectProject={handleSelectProject} 
            onOpenModal={(modalInfo) => setModal(modalInfo)} 
            onBack={() => setView('landing')} 
            guideMode={guideMode}
          />
        );
      case 'dashboard':
        if (!activeProject) {
          setView('projects');
          return null;
        }
        return (
          <ProjectDashboard 
            project={activeProject} 
            onBack={() => { setView('projects'); setActiveProject(null); }} 
            onUpdateProject={handleUpdateProject} 
            onOpenModal={(modalInfo) => setModal(modalInfo)}
            guideMode={guideMode}
            setGuideMode={setGuideMode}
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage 
            onNavigate={setView} 
            onNewProject={() => setModal({ type: 'new', project: null })} 
            onUploadManuscript={() => setModal({ type: 'importManuscript', project: null })}
            guideMode={guideMode}
            setGuideMode={setGuideMode}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={`min-h-screen bg-background text-foreground ${guideMode ? 'guide-mode' : ''}`}>
          <Toaster />
          {renderView()}
          
          {/* Modals */}
          {modal.type === 'new' && (
            <ProjectModal 
              onClose={() => setModal({ type: null, project: null })} 
              onProjectCreated={handleProjectCreated} 
              onSwitchToManuscriptImport={() => setModal({type: 'importManuscript', project: null})}
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
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}