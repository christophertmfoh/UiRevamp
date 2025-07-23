import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import type { Project } from './lib/types';
import { LandingPage } from './components/LandingPage';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ProjectModal, ConfirmDeleteModal, ImportManuscriptModal } from './components/Modals';

const PROJECTS_STORAGE_KEY = 'world-crafter-projects';

// Sample initial projects for demo
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'The Shadow Chronicles',
    type: 'novel',
    description: 'A dark fantasy epic about ancient magic and forgotten realms',
    genre: ['Fantasy', 'Adventure'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    manuscript: {
      novel: 'Chapter 1: The Awakening\n\nThe ancient tome lay open on the weathered desk, its pages glowing with an ethereal light that cast dancing shadows across the stone walls of the forgotten tower...',
      screenplay: ''
    },
    outline: [],
    characters: [],
    locations: [],
    factions: [],
    items: [],
    proseDocuments: [],
    settings: {
      aiCraftConfig: {
        'story-structure': true,
        'character-development': true,
        'world-building': true
      }
    }
  }
];

export default function App() {
  const [view, setView] = useState('landing'); // landing, projects, dashboard
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return savedProjects ? JSON.parse(savedProjects) : initialProjects;
    } catch (error) {
      console.error('Could not load projects from localStorage', error);
      return initialProjects;
    }
  });
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modal, setModal] = useState<{type: string | null; project: Project | null}>({ type: null, project: null });
  const [guideMode, setGuideMode] = useState(false);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Could not save projects to localStorage', error);
    }
  }, [projects]);

  const handleCreateProject = (projectDetails: { name: string; type: 'novel' | 'screenplay' | 'comic'; genres: string[]; outlineTemplate: 'blank' | 'classic-15-beat' | 'three-act' }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectDetails.name,
      type: projectDetails.type,
      description: '',
      genre: projectDetails.genres,
      createdAt: new Date(),
      lastModified: new Date(),
      manuscript: { novel: '', screenplay: '' },
      outline: [],
      characters: [],
      locations: [],
      factions: [],
      items: [],
      proseDocuments: [],
      settings: {
        aiCraftConfig: {
          'story-structure': true,
          'character-development': true,
          'world-building': true
        }
      }
    };
    
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    setView('dashboard');
    setModal({ type: null, project: null });
  };

  const handleCreateProjectFromManuscript = (data: any, fileName: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: fileName.replace(/\.[^/.]+$/, ''),
      type: 'novel',
      description: 'Imported from manuscript',
      genre: [],
      createdAt: new Date(),
      lastModified: new Date(),
      manuscript: { novel: data.manuscriptText || '', screenplay: '' },
      outline: data.outline || [],
      characters: [],
      locations: [],
      factions: [],
      items: [],
      proseDocuments: [],
      settings: {
        aiCraftConfig: {
          'story-structure': true,
          'character-development': true,
          'world-building': true
        }
      }
    };
    
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    setView('dashboard');
    setModal({ type: null, project: null });
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    if (activeProject && activeProject.id === updatedProject.id) {
      setActiveProject(updatedProject);
    }
    setModal({ type: null, project: null });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setModal({ type: null, project: null });
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setView('dashboard');
  };

  const renderView = () => {
    switch(view) {
      case 'projects':
        return (
          <ProjectsView 
            projects={projects} 
            setProjects={setProjects} 
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
              onCreate={handleCreateProject} 
              onSwitchToManuscriptImport={() => setModal({type: 'importManuscript', project: null})}
            />
          )}
          {modal.type === 'edit' && modal.project && (
            <ProjectModal 
              projectToEdit={modal.project} 
              onClose={() => setModal({ type: null, project: null })} 
              onUpdate={handleUpdateProject} 
            />
          )}
          {modal.type === 'rename' && modal.project && (
            <ProjectModal 
              projectToEdit={modal.project} 
              isRenameOnly={true} 
              onClose={() => setModal({ type: null, project: null })} 
              onUpdate={handleUpdateProject} 
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
