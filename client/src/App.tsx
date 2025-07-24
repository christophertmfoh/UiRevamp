import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import type { Project } from './lib/types';
import { LandingPage } from './components/LandingPage';
import { ProjectsView, ProjectDashboard } from './components/project';
import { ProjectModal, ConfirmDeleteModal, ImportManuscriptModal, IntelligentImportModal } from './components/Modals';

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

export default function App() {
  const [view, setView] = useState('landing'); // landing, projects, dashboard
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modal, setModal] = useState<{type: string | null; project: Project | null}>({ type: null, project: null });
  const [guideMode, setGuideMode] = useState(false);

  // Apply scrollbar styles when component mounts and on view changes
  useEffect(() => {
    applyScrollbarStyles();
    
    // Also apply after a brief delay to ensure DOM is ready
    const timer = setTimeout(() => {
      applyScrollbarStyles();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [view]);

  // Apply scrollbar styles on every render for maximum persistence
  useEffect(() => {
    applyScrollbarStyles();
    
    // Nuclear option: inject raw CSS after everything loads
    const forceScrollbarCSS = () => {
      const css = `
        html::-webkit-scrollbar { width: 8px !important; background: transparent !important; display: block !important; }
        html::-webkit-scrollbar-track { background: transparent !important; }
        html::-webkit-scrollbar-thumb { background: #a0967d !important; border-radius: 6px !important; }
        html::-webkit-scrollbar-thumb:hover { background: #8b8269 !important; }
        body::-webkit-scrollbar { width: 8px !important; background: transparent !important; display: block !important; }
        body::-webkit-scrollbar-track { background: transparent !important; }
        body::-webkit-scrollbar-thumb { background: #a0967d !important; border-radius: 6px !important; }
        body::-webkit-scrollbar-thumb:hover { background: #8b8269 !important; }
      `;
      
      const styleEl = document.createElement('style');
      styleEl.textContent = css;
      styleEl.setAttribute('data-nuclear-scrollbar', 'true');
      document.head.appendChild(styleEl);
    };
    
    setTimeout(forceScrollbarCSS, 50);
    setTimeout(forceScrollbarCSS, 200);
    setTimeout(forceScrollbarCSS, 500);
  });

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
      // Handle error silently - user will see no project was created
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
      // Handle error silently - user will see no change occurred
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
      // Handle error silently - user will see project remains
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
      // Handle error silently - user remains on current view
    }
  };

  const renderView = () => {
    switch(view) {
      case 'projects':
        return (
          <ProjectsView 
            onSelectProject={handleSelectProject} 
            onOpenModal={(modalInfo: {type: string | null; project: Project | null}) => setModal(modalInfo)} 
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
            onOpenModal={(modalInfo: {type: string | null; project: Project | null}) => setModal(modalInfo)}
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
          {modal.type === 'import' && (
            <IntelligentImportModal
              onProjectCreated={handleProjectCreated}
              onClose={() => setModal({ type: null, project: null })}
            />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}