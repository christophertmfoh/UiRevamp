

import React, { useState, useRef, useEffect } from 'react';
import { Folder, Plus, Lightbulb, PenSquare, ArrowLeft, GripVertical, MoreVertical, Edit, Trash2, BookUp } from 'lucide-react';
import type { Project } from '../types';
import { BrainstormModal } from './modals';

// --- ActionButton Component ---
interface ActionButtonProps {
    icon: React.ElementType;
    title: string;
    description: string;
    onClick: () => void;
    isFeatured?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, title, description, onClick, isFeatured = false }) => {
  const baseClasses = "w-full p-5 bg-[#2D2D2D]/60 border rounded-lg text-left hover:bg-gray-700/80 transition-all duration-200 group shadow-sm";
  const borderClasses = isFeatured ? "border-blue-500/50 hover:border-blue-400" : "border-gray-700/80 hover:border-gray-600";
  return (
    <button onClick={onClick} className={`${baseClasses} ${borderClasses}`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 bg-gray-900/50 border border-gray-700 rounded-md mr-5 transition-colors ${isFeatured ? 'group-hover:bg-blue-900/50 group-hover:border-blue-600' : 'group-hover:bg-gray-700'}`}>
          <Icon className={`transition-colors ${isFeatured ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'}`} size={24} />
        </div>
        <div><h2 className="text-lg font-semibold text-gray-100">{title}</h2><p className="text-gray-400 text-sm">{description}</p></div>
      </div>
    </button>
  );
};


// --- LandingPage View ---
interface LandingPageProps {
    onNavigate: (view: string) => void;
    onNewProject: () => void;
    onUploadManuscript: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onNewProject, onUploadManuscript }) => {
    const [isBrainstormOpen, setIsBrainstormOpen] = useState(false);
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-lg text-center z-10">
                <header className="mb-12 flex flex-col items-center">
                    <div className="bg-[#2D2D2D] border border-gray-700 p-4 rounded-xl mb-6 shadow-lg"><PenSquare className="text-blue-400" size={40} /></div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-100 font-title">Mythos Weaver</h1>
                    <p className="text-gray-400 mt-4 text-lg">Weave worlds with words.</p>
                </header>
                <main className="space-y-4">
                    <ActionButton icon={Folder} title="View Projects" description="Open and manage your existing creative projects." onClick={() => onNavigate('projects')} />
                    <ActionButton icon={Plus} title="Create New Project" description="Start a new novel, screenplay, or comic from scratch." onClick={onNewProject} />
                    <ActionButton icon={BookUp} title="Upload Manuscript" description="Create a project from an existing manuscript file." onClick={onUploadManuscript} />
                    <ActionButton icon={Lightbulb} title="Brainstorm an Idea" description="Use the Gemini AI to generate story concepts." onClick={() => setIsBrainstormOpen(true)} isFeatured={true} />
                </main>
            </div>
            {isBrainstormOpen && <BrainstormModal project={null} onClose={() => setIsBrainstormOpen(false)} />}
        </div>
    );
}

// --- ProjectItem Component ---
interface ProjectItemProps {
    project: Project;
    onSelectProject: (project: Project) => void;
    onOpenModal: (modal: { type: string, project: Project }) => void;
}
const ProjectItem: React.FC<ProjectItemProps> = ({ project, onSelectProject, onOpenModal }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className="flex items-center gap-2 w-full p-3 bg-[#2D2D2D] border border-gray-700/50 rounded-lg shadow-sm">
            <div className="cursor-move p-2 text-gray-500 hover:text-white"><GripVertical size={20} /></div>
            <button onClick={() => onSelectProject(project)} className="flex-grow text-left px-2">
                <h2 className="text-lg font-semibold text-gray-100">{project.name}</h2>
                <p className="text-sm text-gray-400">{project.type} - {project.genres.join(', ')}</p>
            </button>
            <div className="relative z-20" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"><MoreVertical size={20} /></button>
                {menuOpen && (
                    <div className="absolute right-0 top-10 w-48 bg-[#333333] border border-gray-600 rounded-md shadow-lg animate-fade-in">
                        <button onClick={() => { onOpenModal({ type: 'edit', project }); setMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><Edit size={16} /> Edit Details</button>
                        <button onClick={() => { onOpenModal({ type: 'rename', project }); setMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><PenSquare size={16} /> Rename</button>
                        <button onClick={() => { onOpenModal({ type: 'delete', project }); setMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/50"><Trash2 size={16} /> Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- ProjectsView ---
interface ProjectsViewProps {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    onSelectProject: (project: Project) => void;
    onOpenModal: (modal: { type: string; project: Project | null }) => void;
    onBack: () => void;
}
export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, setProjects, onSelectProject, onOpenModal, onBack }) => {
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => { 
        dragItem.current = position; 
        e.currentTarget.classList.add('dragging'); 
    };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => { 
        dragOverItem.current = position;
        const target = e.currentTarget;
        const listItems = target.closest('.project-list')?.children;
        if (!listItems) return;
        Array.from(listItems).forEach(item => {
            item.classList.remove('drag-over-top', 'drag-over-bottom');
        });
        if (dragItem.current !== dragOverItem.current) {
            const rect = target.getBoundingClientRect();
            const midpoint = rect.top + (rect.height / 2);
            if (e.clientY < midpoint) {
                target.classList.add('drag-over-top');
            } else {
                target.classList.add('drag-over-bottom');
            }
        }
    };
    const handleDrop = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const copyListItems = [...projects];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setProjects(copyListItems);
    };
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => { 
        e.currentTarget.classList.remove('dragging');
        const listItems = e.currentTarget.closest('.project-list')?.children;
        if (!listItems) return;
        Array.from(listItems).forEach(item => {
            item.classList.remove('drag-over-top', 'drag-over-bottom');
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in p-4 sm:p-6">
            <header className="flex items-center justify-between mb-8 pt-4">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ArrowLeft size={18} /> Back</button>
                <h1 className="text-3xl font-bold text-gray-100 font-title">Your Projects</h1>
                <button onClick={() => onOpenModal({type: 'new', project: null})} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center gap-2">
                    <Plus size={16} /> New Project
                </button>
            </header>
            <div className="space-y-3 project-list">
                {projects.map((project, index) => (
                    <div key={project.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                        <ProjectItem project={project} onSelectProject={onSelectProject} onOpenModal={onOpenModal} />
                    </div>
                ))}
            </div>
        </div>
    );
}