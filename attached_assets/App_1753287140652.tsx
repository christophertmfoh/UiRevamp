

import React, { useState, useEffect } from 'react';
import type { Project, OutlineNode, ImportedManuscriptData } from './types';
import { initialProjects, defaultSidebarConfig, emptyWorldBible, CLASSIC_15_BEAT_STORY_STRUCTURE, THREE_ACT_STRUCTURE, ALL_ON_AI_CRAFT_CONFIG } from './constants';
import { GlobalStyles } from './common';
import { LandingPage, ProjectsView } from './views';
import { ProjectDashboard } from './workspace';
import { ProjectModal, ConfirmDeleteModal, ImportManuscriptModal } from './modals';
import { deepCopy } from './utils';

const PROJECTS_STORAGE_KEY = 'mythos-weaver-projects';

export default function App() {
  const [view, setView] = useState('landing'); // landing, projects, dashboard
  const [projects, setProjects] = useState<Project[]>(() => {
      try {
          const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
          return savedProjects ? JSON.parse(savedProjects) : initialProjects;
      } catch (error) {
          console.error("Could not load projects from localStorage", error);
          return initialProjects;
      }
  });
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modal, setModal] = useState<{type: string | null; project: Project | null}>({ type: null, project: null });

  useEffect(() => {
      try {
          localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      } catch (error) {
          console.error("Could not save projects to localStorage", error);
      }
  }, [projects]);


  const handleCreateProject = (projectDetails: { name: string; type: string; genres: string[]; subGenres: string[]; outlineTemplate: 'blank' | 'classic-15-beat' | 'three-act' }) => {
    let outline: OutlineNode[] = [];
    if (projectDetails.outlineTemplate === 'classic-15-beat') {
        outline = deepCopy(CLASSIC_15_BEAT_STORY_STRUCTURE);
    } else if (projectDetails.outlineTemplate === 'three-act') {
        outline = deepCopy(THREE_ACT_STRUCTURE);
    }
    
    const newProject: Project = { 
        id: Date.now(), 
        name: projectDetails.name,
        type: projectDetails.type,
        genres: projectDetails.genres,
        subGenres: projectDetails.subGenres,
        manuscript: { novel: '', screenplay: '' },
        worldBible: deepCopy(emptyWorldBible),
        outline: outline,
        sidebarConfig: deepCopy(defaultSidebarConfig),
        proseDocuments: [],
        aiCraftConfig: deepCopy(ALL_ON_AI_CRAFT_CONFIG),
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    setView('dashboard');
    setModal({ type: null, project: null });
  };
  
  const handleCreateProjectFromManuscript = (data: ImportedManuscriptData, fileName: string) => {
    const newProject: Project = {
        id: Date.now(),
        name: fileName.replace(/\.[^/.]+$/, ""), // Use filename as project name
        type: 'Novel',
        genres: [],
        subGenres: [],
        manuscript: { novel: data.manuscriptText, screenplay: '' },
        worldBible: deepCopy(emptyWorldBible),
        outline: data.outline,
        sidebarConfig: deepCopy(defaultSidebarConfig),
        proseDocuments: [],
        aiCraftConfig: deepCopy(ALL_ON_AI_CRAFT_CONFIG),
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

  const handleDeleteProject = (projectId: number) => {
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
            return <ProjectsView 
                        projects={projects} 
                        setProjects={setProjects} 
                        onSelectProject={handleSelectProject} 
                        onOpenModal={(modalInfo) => setModal(modalInfo)} 
                        onBack={() => setView('landing')} 
                    />;
        case 'dashboard':
            if (!activeProject) {
                setView('projects'); // Failsafe
                return null;
            }
            return <ProjectDashboard 
                        project={activeProject} 
                        onBack={() => { setView('projects'); setActiveProject(null); }} 
                        onUpdateProject={handleUpdateProject} 
                        onOpenModal={(modalInfo) => setModal(modalInfo)}
                    />;
        case 'landing':
        default:
            return <LandingPage 
                        onNavigate={setView} 
                        onNewProject={() => setModal({ type: 'new', project: null })} 
                        onUploadManuscript={() => setModal({ type: 'importManuscript', project: null })}
                    />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen text-gray-300 bg-[#1E1E1E]">
        {renderView()}
        {modal.type === 'new' && <ProjectModal onClose={() => setModal({ type: null, project: null })} onCreate={handleCreateProject} onSwitchToManuscriptImport={() => setModal({type: 'importManuscript', project: null})}/>}
        {modal.type === 'edit' && <ProjectModal projectToEdit={modal.project} onClose={() => setModal({ type: null, project: null })} onUpdate={handleUpdateProject} />}
        {modal.type === 'rename' && <ProjectModal projectToEdit={modal.project} isRenameOnly={true} onClose={() => setModal({ type: null, project: null })} onUpdate={handleUpdateProject} />}
        {modal.type === 'delete' && modal.project && <ConfirmDeleteModal project={modal.project} onClose={() => setModal({ type: null, project: null })} onDelete={handleDeleteProject} />}
        {modal.type === 'importManuscript' && <ImportManuscriptModal projectToUpdate={modal.project} onClose={() => setModal({ type: null, project: null })} onUpdateProject={handleUpdateProject} onCreateProject={handleCreateProjectFromManuscript} />}
      </div>
    </>
  );
}