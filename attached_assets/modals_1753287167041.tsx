

import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, Sparkles, Loader2, X, ChevronDown, UploadCloud, FileText, Check, AlertTriangle, BookUp } from 'lucide-react';
import { brainstormIdea, importAndPopulateWorldBible, importAndPopulateManuscript } from './geminiService';
import type { Project, BrainstormResult, ImportedData, Character, Location, Faction, OutlineNode, ImportedManuscriptData } from './types';
import { genres } from './constants';
import { MultiSelectTagInput } from './common';
import { readFileContent } from './utils';


interface ProjectModalProps {
    onClose: () => void;
    onCreate?: (details: { name: string, type: string, genres: string[], subGenres: string[], outlineTemplate: 'blank' | 'classic-15-beat' | 'three-act' }) => void;
    onUpdate?: (project: Project) => void;
    onSwitchToManuscriptImport?: () => void;
    projectToEdit?: Project | null;
    isRenameOnly?: boolean;
}

const TypeButton = ({ value, children, currentType, setType }: { value: string, children: React.ReactNode, currentType: string, setType: (type: string) => void }) => (
    <button type="button" onClick={() => setType(value)} className={`flex-1 py-2 text-sm rounded-md transition-colors ${currentType === value ? 'bg-blue-600 text-white' : 'bg-gray-700/50 hover:bg-gray-700'}`}>
        {children}
    </button>
);

export function ProjectModal({ onClose, onCreate, onUpdate, onSwitchToManuscriptImport, projectToEdit, isRenameOnly = false }: ProjectModalProps) {
    const [name, setName] = useState(projectToEdit?.name || '');
    const [type, setType] = useState(projectToEdit?.type || 'Novel');
    const [selectedGenres, setSelectedGenres] = useState<string[]>(projectToEdit?.genres || []);
    const [selectedSubGenres, setSelectedSubGenres] = useState<string[]>(projectToEdit?.subGenres || []);
    const [outlineTemplate, setOutlineTemplate] = useState<'blank' | 'classic-15-beat' | 'three-act'>('blank');
    const [creationMode, setCreationMode] = useState('manual');
    
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        if (name.trim()) { 
            if (projectToEdit && onUpdate) { 
                onUpdate({ ...projectToEdit, name: name.trim(), type, genres: selectedGenres, subGenres: selectedSubGenres }); 
            } else if (onCreate) { 
                onCreate({ name: name.trim(), type, genres: selectedGenres, subGenres: selectedSubGenres, outlineTemplate }); 
            } 
        } 
    };

    const title = projectToEdit ? (isRenameOnly ? 'Rename Project' : 'Edit Project Details') : 'Create a New Project';
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                     <div className="p-6 pb-0">
                         <h2 className="text-xl font-bold text-blue-400 font-title">{title}</h2>
                     </div>

                    {!projectToEdit && !isRenameOnly && (
                        <div className="px-6 pt-4">
                            <div className="flex border-b border-gray-700">
                                <button type="button" onClick={() => setCreationMode('manual')} className={`px-4 py-2 text-sm font-semibold transition-colors ${creationMode === 'manual' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Create Manually</button>
                                <button type="button" onClick={onSwitchToManuscriptImport} className={`px-4 py-2 text-sm font-semibold transition-colors ${creationMode === 'import' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Import from Manuscript</button>
                            </div>
                        </div>
                    )}
                    
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="project-name" className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                            <input id="project-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" autoFocus />
                        </div>

                        {!isRenameOnly && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                                    <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                                        <TypeButton value="Novel" currentType={type} setType={setType}>Novel</TypeButton>
                                        <TypeButton value="Screenplay" currentType={type} setType={setType}>Screenplay</TypeButton>
                                        <TypeButton value="Script" currentType={type} setType={setType}>Script</TypeButton>
                                        <TypeButton value="Comic/Graphic Novel" currentType={type} setType={setType}>Comic</TypeButton>
                                    </div>
                                </div>
                                <MultiSelectTagInput 
                                    label="Genres"
                                    placeholder="Select up to 5 genres..."
                                    tags={selectedGenres}
                                    setTags={setSelectedGenres}
                                    suggestions={genres}
                                    maxTags={5}
                                />
                                <MultiSelectTagInput 
                                    label="Sub-Genres"
                                    placeholder="Select up to 5 sub-genres..."
                                    tags={selectedSubGenres}
                                    setTags={setSelectedSubGenres}
                                    suggestions={genres}
                                    maxTags={5}
                                />
                            </>
                        )}
                        
                        {!projectToEdit && !isRenameOnly && (
                            <div>
                                <label htmlFor="outline-template" className="block text-sm font-medium text-gray-300 mb-2">Outline Template</label>
                                <div className="relative">
                                    <select id="outline-template" value={outlineTemplate} onChange={(e) => setOutlineTemplate(e.target.value as any)} className="w-full appearance-none bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="blank">Blank Outline</option>
                                        <option value="classic-15-beat">Classic 15-Beat Story Structure</option>
                                        <option value="three-act">Classic Three-Act Structure</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">Cancel</button>
                        <button type="submit" disabled={!name.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed">{projectToEdit ? 'Save Changes' : 'Create Project'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ConfirmDeleteModal({ project, onClose, onDelete }: { project: Project, onClose: () => void, onDelete: (id: number) => void }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6"><h2 className="text-xl font-bold text-red-500 font-title mb-2">Delete Project</h2><p>Are you sure you want to permanently delete <span className="font-semibold text-white">"{project.name}"</span>? This action cannot be undone.</p></div>
                <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">Cancel</button>
                    <button type="button" onClick={() => onDelete(project.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md">Delete Project</button>
                </div>
            </div>
        </div>
    );
}

export function BrainstormModal({ project, onClose }: { project: Project | null, onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BrainstormResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) { setError("Please enter a concept to brainstorm."); return; }
    setIsLoading(true); setResult(null); setError(null);
    try {
        const brainstormResult = await brainstormIdea(prompt, project);
        setResult(brainstormResult);
    } catch (err) {
        console.error("Gemini API call failed:", err);
        const message = err instanceof Error ? err.message : "Failed to generate ideas. Please try again.";
        setError(message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-blue-400 flex items-center font-title"><Lightbulb className="mr-3" />Brainstorm Story Ideas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">Enter a high-level concept:</label>
            <input id="prompt-input" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A detective story in a city that never sleeps..." className="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button onClick={handleGenerate} disabled={isLoading} className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600">
              {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
              {isLoading ? 'Generating...' : 'Generate Ideas'}
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
          {result && (
            <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-4 animate-fade-in">
              <div><h3 className="text-lg font-semibold text-blue-400 font-title">Title Suggestion:</h3><p className="text-gray-200">{result.title}</p></div>
              <div><h3 className="text-lg font-semibold text-blue-400 font-title">Logline:</h3><p className="text-gray-200">{result.logline}</p></div>
              <div><h3 className="text-lg font-semibold text-blue-400 font-title">Character Archetypes:</h3><ul className="list-disc list-inside text-gray-300 space-y-1">{result.characters.map((char, i) => <li key={i}>{char}</li>)}</ul></div>
              <div><h3 className="text-lg font-semibold text-blue-400 font-title">Plot Hooks:</h3><ul className="list-disc list-inside text-gray-300 space-y-1">{result.plot_hooks.map((hook, i) => <li key={i}>{hook}</li>)}</ul></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ImportWorldBibleModal({ project, onUpdateProject, onClose }: { project: Project, onUpdateProject: (p: Project) => void, onClose: () => void }) {
    const [status, setStatus] = useState<'idle' | 'parsing' | 'generating' | 'confirm' | 'error'>('idle');
    const [fileName, setFileName] = useState('');
    const [importedData, setImportedData] = useState<ImportedData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        setStatus('parsing');
        setError(null);
        setFileName(file.name);
        try {
            const content = await readFileContent(file);
            setStatus('generating');
            const data = await importAndPopulateWorldBible(content);
            setImportedData(data);
            setStatus('confirm');
        } catch (err) {
            console.error("Error processing file:", err);
            const message = err instanceof Error ? err.message : `Failed to process ${file.name}.`;
            setError(message);
            setStatus('error');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleMerge = () => {
        if (!importedData) return;
        
        const newWorldBible = { ...project.worldBible };

        // Add new characters
        importedData.worldBible.characters.forEach((char) => {
            if (!newWorldBible.characters.some(existing => existing.name.toLowerCase() === char.name.toLowerCase())) {
                const newCharacter: Character = {
                    id: Date.now() + Math.random(),
                    name: char.name,
                    aliases: char.aliases,
                    archetype: char.archetype,
                    role: char.role,
                    description: char.description,
                    personalityTraits: '', strengths: '', flaws: '', backstory: '', fears: '', secrets: '', motivations: '', storyArc: '', internalConflict: '', abilities: '', psychologicalProfile: '',
                    imageGallery: [], modelImageUrls: [], relationships: [], notes: '',
                };
                newWorldBible.characters.push(newCharacter);
            }
        });

        // Add new locations
        importedData.worldBible.locations.forEach((loc) => {
             if (!newWorldBible.locations.some(existing => existing.name.toLowerCase() === loc.name.toLowerCase())) {
                const newLocation: Location = {
                    id: Date.now() + Math.random(),
                    name: loc.name,
                    type: loc.type,
                    description: loc.description,
                    imageGallery: [], modelImageUrls: [], history: '', keyLandmarks: '', postCataclysmImpact: '', dominantPeoples: '', governance: '',
                };
                newWorldBible.locations.push(newLocation);
            }
        });
        
        // Add new factions
        importedData.worldBible.factions.forEach((fac) => {
            if (!newWorldBible.factions.some(existing => existing.name.toLowerCase() === fac.name.toLowerCase())) {
                const newFaction: Faction = {
                    id: Date.now() + Math.random(),
                    name: fac.name,
                    type: fac.type,
                    description: fac.description,
                    ideology: fac.ideology,
                    leadership: '', methods: '', strongholds: '', impactOnWorld: '', goals: '', allies: [], enemies: [],
                };
                newWorldBible.factions.push(newFaction);
            }
        });

        const updatedProject: Project = {
            ...project,
            outline: importedData.outline,
            worldBible: newWorldBible,
        };

        onUpdateProject(updatedProject);
        onClose();
    };

    const renderContent = () => {
        switch(status) {
            case 'parsing':
            case 'generating':
                return <div className="text-center p-8 space-y-3"><Loader2 className="animate-spin text-blue-400 mx-auto" size={40} /><p className="text-gray-300"> {status === 'parsing' ? `Parsing ${fileName}...` : `AI is analyzing your document...`}</p><p className="text-sm text-gray-500">This may take a moment for large files.</p></div>;
            case 'confirm':
                if (!importedData) return null;
                const { outline, worldBible } = importedData;
                return (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2"><Check className="text-green-400"/>Analysis Complete</h3>
                        <div className="space-y-3 text-sm bg-black/20 p-4 rounded-md">
                            <p>Here's what we found in <span className="font-semibold text-blue-300">{fileName}</span>:</p>
                            <ul className="list-disc list-inside text-gray-300">
                                <li>{outline.length} top-level outline nodes</li>
                                <li>{worldBible.characters.length} characters</li>
                                <li>{worldBible.locations.length} locations</li>
                                <li>{worldBible.factions.length} factions</li>
                            </ul>
                            <p className="text-xs text-gray-400 pt-2">Merging will <span className="font-bold text-yellow-400">replace</span> your current outline and <span className="font-bold text-green-400">add</span> new World Bible entries if they don't already exist.</p>
                        </div>
                    </div>
                );
            case 'error':
                 return <div className="text-center p-8 space-y-3"><AlertTriangle className="text-red-500 mx-auto" size={40} /><p className="text-red-400 font-semibold">An Error Occurred</p><p className="text-sm text-gray-400">{error}</p></div>;
            case 'idle':
            default:
                 return (
                    <div 
                        onDrop={handleDrop} 
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        className="p-8 border-2 border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-black/20 transition-colors"
                    >
                         <UploadCloud className="mx-auto text-gray-500 mb-2" size={40} />
                         <p className="text-gray-300 font-semibold">Click to upload or drag & drop</p>
                         <p className="text-sm text-gray-500">.txt, .pdf, or .docx</p>
                    </div>
                 )
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-blue-400 flex items-center font-title"><FileText className="mr-3" />Import World Bible</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                 <div className="p-6">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.pdf,.docx" className="hidden" />
                    {renderContent()}
                </div>
                <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">Cancel</button>
                    {status === 'confirm' && <button onClick={handleMerge} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">Merge into Project</button>}
                    {status === 'error' && <button onClick={() => setStatus('idle')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">Try Again</button>}
                </div>
            </div>
        </div>
    )
}

interface ImportManuscriptModalProps {
    onClose: () => void;
    onUpdateProject?: (p: Project) => void;
    onCreateProject?: (data: ImportedManuscriptData, fileName: string) => void;
    projectToUpdate?: Project | null;
}

export function ImportManuscriptModal({ onClose, onUpdateProject, onCreateProject, projectToUpdate }: ImportManuscriptModalProps) {
    const [status, setStatus] = useState<'idle' | 'parsing' | 'generating' | 'confirm' | 'error'>('idle');
    const [fileName, setFileName] = useState('');
    const [importedData, setImportedData] = useState<ImportedManuscriptData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        setStatus('parsing'); setError(null); setFileName(file.name);
        try {
            const content = await readFileContent(file);
            setStatus('generating');
            const data = await importAndPopulateManuscript(content);
            setImportedData(data);
            setStatus('confirm');
        } catch (err) {
            console.error("Error processing file:", err);
            const message = err instanceof Error ? err.message : `Failed to process ${file.name}.`;
            setError(message);
            setStatus('error');
        }
    };
    
    const handleAction = () => {
        if (!importedData) return;
        if (projectToUpdate && onUpdateProject) { // Update existing project
            const updatedProject: Project = {
                ...projectToUpdate,
                outline: importedData.outline,
                manuscript: { ...projectToUpdate.manuscript, novel: importedData.manuscriptText },
            };
            onUpdateProject(updatedProject);
        } else if (onCreateProject) { // Create new project
            onCreateProject(importedData, fileName);
        }
        onClose();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };

    const renderContent = () => {
        switch(status) {
            case 'parsing': case 'generating':
                return <div className="text-center p-8 space-y-3"><Loader2 className="animate-spin text-blue-400 mx-auto" size={40} /><p className="text-gray-300">{status === 'parsing' ? `Parsing ${fileName}...` : `AI is analyzing your manuscript...`}</p><p className="text-sm text-gray-500">This may take a moment.</p></div>;
            case 'confirm':
                if (!importedData) return null;
                return (
                    <div className="p-6"><h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2"><Check className="text-green-400"/>Analysis Complete</h3><div className="space-y-3 text-sm bg-black/20 p-4 rounded-md"><p>Found <span className="font-semibold text-blue-300">{importedData.outline.length} chapters</span> in {fileName}.</p>{projectToUpdate && <p className="text-xs text-gray-400 pt-2">Importing will <span className="font-bold text-yellow-400">replace</span> your current manuscript and outline.</p>}</div></div>
                );
            case 'error':
                 return <div className="text-center p-8 space-y-3"><AlertTriangle className="text-red-500 mx-auto" size={40} /><p className="text-red-400 font-semibold">An Error Occurred</p><p className="text-sm text-gray-400">{error}</p></div>;
            default:
                 return (<div onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => fileInputRef.current?.click()} className="p-8 border-2 border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-black/20 transition-colors"><UploadCloud className="mx-auto text-gray-500 mb-2" size={40} /><p className="text-gray-300 font-semibold">Click to upload or drag & drop</p><p className="text-sm text-gray-500">.txt, .pdf, or .docx</p></div>)
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-4 border-b border-gray-700/50"><h2 className="text-xl font-bold text-blue-400 flex items-center font-title"><BookUp className="mr-3" />Import Manuscript</h2><button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button></div>
                 <div className="p-6"><input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.pdf,.docx" className="hidden" />{renderContent()}</div>
                <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">Cancel</button>
                    {status === 'confirm' && <button onClick={handleAction} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">{projectToUpdate ? "Import and Replace" : "Create Project"}</button>}
                    {status === 'error' && <button onClick={() => setStatus('idle')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">Try Again</button>}
                </div>
            </div>
        </div>
    )
}