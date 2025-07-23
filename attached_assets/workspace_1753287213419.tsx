








import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    ArrowLeft, Plus, Cog, Trash2, Grip, ChevronRight, FileText, Bot, Users, Palette, Loader2, BrainCircuit, BookOpen, Scroll, User, History, StickyNote, Telescope, Map, Flag, Castle, Eye, Binary, Link, Edit, Sword, Sparkles, ChevronDown, X, UploadCloud, CheckCircle2, Image as ImageIcon, Star, BookText, DraftingCompass, FileUp, BookUp, AlertTriangle, Lightbulb
} from 'lucide-react';
import { useDebouncedSave } from './useDebouncedSave';
import { 
    generateNewCharacter, fleshOutCharacter, generateCharacterImage, 
    fleshOutItem, generateItemImage, 
    generateLocationImage, fleshOutLocation,
    fleshOutFaction, getAICoachFeedback
} from './geminiService';
import { iconMap, AI_CONFIGURABLE_TOOLS, characterArchetypes, BUILT_IN_CRAFT_KNOWLEDGE, ALL_ON_AI_CRAFT_CONFIG, ALL_OFF_AI_CRAFT_CONFIG } from './constants';
import type { Project, SidebarItem, OutlineNode, Character, Location, Faction, CharacterRelationship, Item, GeneratedCharacter, FleshedOutCharacter, ImageAsset, ProseDocument, AICoachFeedback, AICraftConfig, AICraftPreset } from './types';
import { ToolPlaceholder, MultiSelectTagInput } from './common';
import { ImportWorldBibleModal } from './modals';
import { readFileContent } from './utils';

// ========================================================================================
// SECTION: SHARED WORKSPACE COMPONENTS
// ========================================================================================

const DetailTextarea = ({ label, value, onChange, placeholder, rows = 3 }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder: string, rows?: number }) => (
    <div>
        <label className="text-sm font-semibold text-gray-400 mb-1.5 block">{label}</label>
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="w-full bg-[#2D2D2D] border border-gray-700/50 rounded-lg p-3 text-gray-200 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-y" />
    </div>
);

const DetailInput = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }) => (
    <div>
        <label className="text-sm font-semibold text-gray-400 mb-1.5 block">{label}</label>
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-[#2D2D2D] border border-gray-700/50 rounded-lg px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
    </div>
);


// ========================================================================================
// SECTION: AI MODALS
// ========================================================================================

const GenerateCharacterModal = ({ onClose, onGenerate, project }: { onClose: () => void, onGenerate: (char: GeneratedCharacter) => void, project: Project }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) { setError("Please enter a concept."); return; }
        setIsLoading(true); setError('');
        try {
            const result = await generateNewCharacter(prompt, project, 'character-generator');
            onGenerate(result);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate character.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-blue-400 flex items-center font-title"><Sparkles className="mr-3" />Generate New Character</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">Enter a high-level concept:</label>
                    <input id="prompt-input" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A grizzled dwarven warrior who lost his clan..." className="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" autoFocus/>
                     {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">Cancel</button>
                    <button onClick={handleGenerate} disabled={isLoading || !prompt} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    )
};

const AICoachModal = ({ isOpen, onClose, project, nodeTitle, nodeContent }: { isOpen: boolean, onClose: () => void, project: Project, nodeTitle: string, nodeContent: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<AICoachFeedback | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchFeedback = async () => {
                setIsLoading(true);
                setFeedback(null);
                setError(null);
                try {
                    const result = await getAICoachFeedback(project, nodeTitle, nodeContent);
                    setFeedback(result);
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to get AI feedback.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFeedback();
        }
    }, [isOpen, project, nodeTitle, nodeContent]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-blue-400 flex items-center font-title"><Bot className="mr-3" />AI Writing Coach: {nodeTitle}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="animate-spin text-blue-400" size={48} />
                            <p className="mt-4 text-gray-400">Analyzing your story beat...</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {feedback && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-400 font-title mb-2">Core Principle Analysis</h3>
                                <p className="text-gray-300 whitespace-pre-wrap">{feedback.corePrincipleAnalysis}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-400 font-title mb-2">Actionable Suggestions</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    {feedback.actionableSuggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-400 font-title mb-2">Guiding Questions</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    {feedback.guidingQuestions.map((question, i) => <li key={i}>{question}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ========================================================================================
// SECTION: SIDEBAR
// ========================================================================================

interface SidebarItemNodeProps {
    item: SidebarItem;
    path: string;
    isDraggable?: boolean;
    isEditing?: boolean;
    activeTool: string;
    setActiveTool: (toolId: string) => void;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, path: string) => void;
    onDragEnter?: (e: React.DragEvent<HTMLDivElement>, path: string) => void;
    onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
    onToggleVisibility?: (path: string) => void;
    children?: React.ReactNode;
}

const SidebarItemNode: React.FC<SidebarItemNodeProps> = ({ 
    item, path, isDraggable = false, isEditing = false, activeTool, setActiveTool, 
    onDragStart = () => {}, onDragEnter = () => {}, onDragEnd = () => {}, onDrop = () => {}, onToggleVisibility = () => {},
    children
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = iconMap[item.icon] || FileText;
    const isFolder = (item.children && item.children.length > 0) || !!children;
    
    const handleActivateTool = () => {
        setActiveTool(item.toolId);
    };

    const handleToggleFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFolder) setIsOpen(!isOpen);
    };
    
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleVisibility(path);
    };

    return (
        <div>
            <div
                role="button" tabIndex={0} onClick={handleActivateTool}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleActivateTool() }}
                className={`flex items-center w-full p-3 rounded-lg text-left transition-colors group relative cursor-pointer ${activeTool === item.toolId ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}
                draggable={isDraggable} onDragStart={(e) => onDragStart(e, path)} onDragEnter={(e) => onDragEnter(e, path)}
                onDragEnd={onDragEnd} onDrop={onDrop}
            >
                {isDraggable && <Grip size={18} className="mr-2 cursor-move text-gray-500" />}
                <div className="flex items-center flex-grow"><Icon size={20} className="mr-3 flex-shrink-0" /><span className="flex-grow">{item.label}</span></div>
                {isFolder && (<button aria-label={isOpen ? "Collapse" : "Expand"} onClick={handleToggleFolder} className="p-1 -mr-1 rounded-sm z-10"><ChevronRight size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} /></button>)}
                {isEditing && (
                    <div onClick={handleToggle} className="ml-2 flex items-center z-10">
                        <div className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer transition-colors ${item.isVisible ? 'bg-blue-600' : 'bg-gray-600'}`}>
                            <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${item.isVisible ? 'translate-x-5' : ''}`} />
                        </div>
                    </div>
                )}
            </div>
            {isFolder && isOpen && (
                <div className="mt-1 pl-6 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
}

const Sidebar = ({ items, setItems, isEditing, activeTool, setActiveTool }: { items: SidebarItem[], setItems: (items: SidebarItem[]) => void, isEditing: boolean, activeTool: string, setActiveTool: (toolId: string) => void }) => {
    const dragItem = useRef<string | null>(null);
    const dragOverItem = useRef<string | null>(null);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, path: string) => { dragItem.current = path; };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, path: string) => {
        dragOverItem.current = path;
        e.currentTarget.closest('nav')?.querySelectorAll('[draggable="true"]').forEach(item => item.classList.remove('drag-over'));
        e.currentTarget.classList.add('drag-over');
    };

    const handleDrop = () => {
        if (!dragItem.current || !dragOverItem.current || dragItem.current === dragOverItem.current) return;
    
        const newItems = JSON.parse(JSON.stringify(items));
    
        const dragPath = dragItem.current.split('-').map(Number);
        const dropPath = dragOverItem.current.split('-').map(Number);
    
        if (dragPath.length !== dropPath.length || dragPath.length < 2) return;
        
        const parentPath = dragPath.slice(0, -1);
        
        let parentNode = newItems;
        for (const index of parentPath) {
            parentNode = parentNode[index].children!;
        }
    
        const dragIndex = dragPath[dragPath.length - 1];
        const dropIndex = dropPath[dropPath.length - 1];
    
        const [draggedItem] = parentNode.splice(dragIndex, 1);
        parentNode.splice(dropIndex, 0, draggedItem);
        
        setItems(newItems);
    
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.closest('nav')?.querySelectorAll('[draggable="true"]').forEach(item => item.classList.remove('drag-over'));
    };
    
    const handleToggleVisibility = (path: string) => {
        const pathArr = path.split('-').map(Number);
        const newItems = JSON.parse(JSON.stringify(items));
        
        let itemToToggle: SidebarItem | undefined;
        let currentLevel: SidebarItem[] | undefined = newItems;

        for (const index of pathArr) {
            if (!currentLevel || !currentLevel[index]) return;
            itemToToggle = currentLevel[index];
            currentLevel = itemToToggle.children;
        }

        if (itemToToggle) {
             // To get the actual item from the path, we need to traverse down
            let targetItem = newItems[pathArr[0]];
            if (pathArr.length > 1) {
                for (let i = 1; i < pathArr.length; i++) {
                    targetItem = targetItem.children![pathArr[i]];
                }
            }
            targetItem.isVisible = !targetItem.isVisible;
            setItems(newItems);
        }
    };
    
    const worldBibleItem = items.find(item => item.id === 'world-bible');
    const staticItems = items.filter(item => item.id !== 'world-bible');
    const worldBibleIndex = items.findIndex(i => i.id === 'world-bible');

    return (
        <nav className="flex-1 flex flex-col space-y-1" onDragOver={e => isEditing && e.preventDefault()}>
           {worldBibleItem &&
             <SidebarItemNode 
                key={worldBibleItem.id} item={worldBibleItem} path={`${worldBibleIndex}`}
                activeTool={activeTool} setActiveTool={setActiveTool} 
             >
                {(worldBibleItem.children || []).map((child, index) => {
                    if (!child.isVisible && !isEditing) return null;
                    return (
                        <SidebarItemNode 
                            key={child.id} item={child} path={`${worldBibleIndex}-${index}`}
                            isDraggable={isEditing} isEditing={isEditing}
                            activeTool={activeTool} setActiveTool={setActiveTool}
                            onDragStart={handleDragStart} onDragEnter={handleDragEnter} 
                            onDragEnd={handleDragEnd} onDrop={handleDrop} onToggleVisibility={handleToggleVisibility}
                        />
                    );
                })}
             </SidebarItemNode>
           }
           {staticItems.map((item) => (
             <SidebarItemNode 
                key={item.id} item={item} 
                path={`${items.findIndex(i => i.id === item.id)}`}
                activeTool={activeTool} setActiveTool={setActiveTool}
            />
           ))}
        </nav>
    );
}


// ========================================================================================
// SECTION: MANUSCRIPT VIEW
// ========================================================================================

const ManuscriptView = ({ project, onUpdateProject }: { project: Project, onUpdateProject: (p: Project) => void }) => {
    const [novelText, setNovelText] = useState(project.manuscript.novel);
    const [screenplayText, setScreenplayText] = useState(project.manuscript.screenplay);

    const debouncedSave = useCallback(() => {
        onUpdateProject({ ...project, manuscript: { novel: novelText, screenplay: screenplayText }});
    }, [novelText, screenplayText, onUpdateProject, project]);

    useDebouncedSave(debouncedSave, 1000);

    return (
        <div className="flex-1 flex flex-col p-8">
            <h2 className="text-2xl font-bold text-gray-100 font-title mb-4">Manuscript</h2>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Novel</h3>
                    <textarea value={novelText} onChange={(e) => setNovelText(e.target.value)} className="flex-1 w-full bg-[#2D2D2D] border border-gray-700/50 rounded-lg p-4 text-gray-200 font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Start writing your novel here..." />
                </div>
                <div className="hidden lg:flex items-center justify-center">
                    <button className="p-3 bg-gray-800 border border-gray-700 rounded-full text-blue-400 hover:bg-blue-900/50 hover:border-blue-600 transition-all" title="AI Transcription (Coming Soon)"><Bot size={24} /></button>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Screenplay</h3>
                    <textarea value={screenplayText} onChange={(e) => setScreenplayText(e.target.value)} className="flex-1 w-full bg-[#2D2D2D] border border-gray-700/50 rounded-lg p-4 text-gray-200 font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Start writing your screenplay here..." />
                </div>
            </div>
        </div>
    );
}

// ========================================================================================
// SECTION: OUTLINE VIEW
// ========================================================================================

const OutlineNodeComponent = ({ node, onUpdate, onAddChild, onDelete, level = 0, onAICoachRequest }: { node: OutlineNode, onUpdate: (n: OutlineNode) => void, onAddChild: (parentId: number, title: string) => void, onDelete: (id: number) => void, level?: number, onAICoachRequest: (node: OutlineNode) => void }) => {
    const [title, setTitle] = useState(node.title);
    const [content, setContent] = useState(node.content);
    
    const debouncedSave = useCallback(() => {
        onUpdate({ ...node, title, content });
    }, [title, content, node, onUpdate]);

    useDebouncedSave(debouncedSave, 1000);

    const childTitle = level === 0 ? "New Chapter" : "New Scene";

    return (
        <div style={{ marginLeft: `${level * 2}rem` }} className="bg-[#2D2D2D]/50 border-l-2 border-gray-700 p-4 rounded-r-lg group/node relative">
            <div className="flex justify-between items-center mb-2">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="text-lg font-semibold text-gray-200 font-title bg-transparent focus:outline-none w-full" />
                <div className="flex items-center gap-2 opacity-0 group-hover/node:opacity-100 transition-opacity">
                     <button onClick={() => onAICoachRequest(node)} title="AI Writing Coach" className="p-1 text-blue-400 hover:text-white hover:bg-blue-700/50 rounded"><Bot size={16} /></button>
                     <button onClick={() => onAddChild(node.id, childTitle)} title="Add Section" className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"><Plus size={16} /></button>
                     <button onClick={() => onDelete(node.id)} title="Delete Section" className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded"><Trash2 size={16} /></button>
                </div>
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={node.description || "Describe this section..."} className="w-full bg-transparent text-gray-300 focus:outline-none resize-y min-h-[50px] placeholder:italic placeholder:text-gray-500" />
            <div className="mt-2 space-y-4">
                {node.children.map(child => <OutlineNodeComponent key={child.id} node={child} onUpdate={onUpdate} onAddChild={onAddChild} onDelete={onDelete} level={level + 1} onAICoachRequest={onAICoachRequest} />)}
            </div>
        </div>
    );
}

const OutlineView = ({ project, onUpdateProject }: { project: Project, onUpdateProject: (p: Project) => void }) => {
    const [coachingNode, setCoachingNode] = useState<OutlineNode | null>(null);
    
    const updateOutline = (newOutline: OutlineNode[]) => onUpdateProject({ ...project, outline: newOutline });

    const handleAICoachRequest = (node: OutlineNode) => {
        setCoachingNode(node);
    };

    const addNode = (parentId: number | null = null, title = "New Top-Level Section") => {
        const newNode: OutlineNode = { id: Date.now(), title, content: '', children: [] };
        if (parentId === null) { updateOutline([...project.outline, newNode]); return; }
        const addRec = (nodes: OutlineNode[]): OutlineNode[] => nodes.map(node => node.id === parentId ? { ...node, children: [...node.children, newNode] } : { ...node, children: addRec(node.children) });
        updateOutline(addRec(project.outline));
    };

    const updateNode = (updatedNode: OutlineNode) => {
        const updateRec = (nodes: OutlineNode[]): OutlineNode[] => nodes.map(node => node.id === updatedNode.id ? updatedNode : { ...node, children: updateRec(node.children) });
        updateOutline(updateRec(project.outline));
    };
    
    const deleteNode = (nodeId: number) => {
        const deleteRec = (nodes: OutlineNode[]): OutlineNode[] => nodes.filter(node => node.id !== nodeId).map(node => ({ ...node, children: deleteRec(node.children) }));
        updateOutline(deleteRec(project.outline));
    };

    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100 font-title">Story Outline</h2>
                <button onClick={() => addNode(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center gap-2"><Plus size={16} /> New Section</button>
            </div>
            <div className="space-y-4">
                {project.outline.map(node => <OutlineNodeComponent key={node.id} node={node} onUpdate={updateNode} onAddChild={addNode} onDelete={deleteNode} onAICoachRequest={handleAICoachRequest} />)}
            </div>
            {coachingNode && (
                <AICoachModal 
                    isOpen={!!coachingNode}
                    onClose={() => setCoachingNode(null)}
                    project={project}
                    nodeTitle={coachingNode.title}
                    nodeContent={coachingNode.content}
                />
            )}
        </div>
    );
}

// ========================================================================================
// SECTION: WORLD BIBLE - CHARACTER LIBRARY
// ========================================================================================

const ManagePortraitsModal = ({ character, onUpdateCharacter, onClose }: { character: Character; onUpdateCharacter: (char: Character) => void; onClose: () => void; }) => {
    const [stylePrompt, setStylePrompt] = useState('');
    const [engine, setEngine] = useState<'gemini' | 'midjourney' | 'openai'>('gemini');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const imageUrl = await generateCharacterImage(character, stylePrompt, engine);
            const newPortrait: ImageAsset = { id: Date.now(), url: imageUrl };
            const updatedCharacter = {
                ...character,
                imageGallery: [...character.imageGallery, newPortrait]
            };
            onUpdateCharacter(updatedCharacter);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate portrait.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = (portraitId: number) => {
        if (character.displayImageId === portraitId) {
            alert("Cannot delete the current display image. Please set another image as display first.");
            return;
        }
        const isSelectedModelImage = character.modelImageUrls.some(url => character.imageGallery.find(p => p.id === portraitId)?.url === url);
        if (isSelectedModelImage) {
            alert("Cannot delete an image that is part of the trained model. Please deselect it first.");
            return;
        }
        const updatedCharacter = {
            ...character,
            imageGallery: character.imageGallery.filter(p => p.id !== portraitId)
        };
        onUpdateCharacter(updatedCharacter);
    };
    
    const handleSetDisplayImage = (portraitId: number) => {
        onUpdateCharacter({ ...character, displayImageId: portraitId });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                     const newPortrait: ImageAsset = { id: Date.now(), url: event.target.result as string };
                     const updatedCharacter = { ...character, imageGallery: [...character.imageGallery, newPortrait] };
                     onUpdateCharacter(updatedCharacter);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleToggleModelImage = (imageUrl: string) => {
        const isSelected = character.modelImageUrls.includes(imageUrl);
        let newModelUrls;
        if (isSelected) {
            newModelUrls = character.modelImageUrls.filter(url => url !== imageUrl);
        } else {
            if (character.modelImageUrls.length >= 10) {
                alert("You can select a maximum of 10 images for the model.");
                return;
            }
            newModelUrls = [...character.modelImageUrls, imageUrl];
        }
        onUpdateCharacter({ ...character, modelImageUrls: newModelUrls });
    };

    const handleTrainModel = () => {
        if (character.modelImageUrls.length < 5) {
            alert("Please select at least 5 images to train the model.");
            return;
        }
        // Here you would typically trigger a backend process.
        // For now, we'll just simulate it on the frontend.
        alert(`Training model for ${character.name} with ${character.modelImageUrls.length} images... (simulation)`);
        onUpdateCharacter({ ...character, isModelTrained: true });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-blue-400 font-title">Manage Portraits for {character.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                         <div className="p-4 bg-black/20 rounded-lg space-y-4">
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">1. Generate or Upload</h3>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Engine</label>
                                <select value={engine} onChange={e => setEngine(e.target.value as any)} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="gemini">Gemini</option>
                                    <option value="midjourney">Midjourney</option>
                                    <option value="openai">OpenAI (DALL-E)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Style Prompt</label>
                                <input type="text" value={stylePrompt} onChange={(e) => setStylePrompt(e.target.value)} placeholder="e.g., oil painting, dark fantasy" className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <button onClick={handleGenerate} disabled={isGenerating} className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600">
                                {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </button>
                             <div className="flex items-center gap-2"><div className="flex-grow h-px bg-gray-700"></div><span className="text-gray-500 text-sm">OR</span><div className="flex-grow h-px bg-gray-700"></div></div>
                             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden"/>
                             <button onClick={() => fileInputRef.current?.click()} className="w-full flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"><UploadCloud className="mr-2" /> Upload Image</button>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg space-y-4">
                             <h3 className="text-lg font-semibold text-gray-300 mb-2">2. Train Model</h3>
                             <p className="text-sm text-gray-400">Select 5-10 images from the gallery to create a consistent visual model for this character.</p>
                             <div className="text-center text-sm p-2 rounded-md bg-gray-800 text-gray-300">
                                {character.modelImageUrls.length} / 10 images selected
                             </div>
                             <button onClick={handleTrainModel} disabled={character.modelImageUrls.length < 5} className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed">
                                Train Character Model
                             </button>
                             {character.isModelTrained && <p className="text-green-400 text-sm flex items-center justify-center gap-2"><CheckCircle2 size={16}/> Model Trained!</p>}
                        </div>

                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    </div>

                    <div className="lg:col-span-2">
                         <h3 className="text-lg font-semibold text-gray-300 mb-2">Portrait Gallery</h3>
                         {character.imageGallery.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {character.imageGallery.map(portrait => {
                                    const isSelected = character.modelImageUrls.includes(portrait.url);
                                    const isDisplay = character.displayImageId === portrait.id;
                                    return (
                                        <div key={portrait.id} className={`relative group aspect-[3/4] bg-gray-800 rounded-md overflow-hidden border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
                                            <img src={portrait.url} alt="Character portrait" className="w-full h-full object-cover" />
                                            {isDisplay && <Star className="absolute top-1 left-1 w-5 h-5 text-yellow-400 fill-yellow-400" />}
                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                                                <button onClick={() => handleSetDisplayImage(portrait.id)} className="w-full py-1.5 text-xs rounded bg-gray-200 hover:bg-white text-black">Set as Display</button>
                                                <button onClick={() => handleToggleModelImage(portrait.url)} className={`w-full py-1.5 text-xs rounded ${isSelected ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-gray-200 hover:bg-white text-black'}`}>
                                                    {isSelected ? 'Deselect' : 'Select for Model'}
                                                </button>
                                                <button onClick={() => handleDelete(portrait.id)} className="p-2 bg-red-600/80 text-white rounded-full hover:bg-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                         ) : (
                            <div className="h-full flex items-center justify-center text-center text-gray-500 border-2 border-dashed border-gray-700 rounded-lg p-8">
                                <div><ImageIcon size={40} className="mx-auto mb-2" /><p>No portraits yet.</p><p className="text-sm">Generate or upload one.</p></div>
                            </div>
                         )}
                    </div>
                </div>
                 <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">Done</button>
                </div>
            </div>
        </div>
    );
};

const CharacterDetail = ({ character, onUpdate, onDelete, project, projectCharacters }: { character: Character, onUpdate: (char: Character) => void, onDelete: () => void, project: Project, projectCharacters: Character[] }) => {
    const [charData, setCharData] = useState(character);
    const [activeTab, setActiveTab] = useState('profile');
    const [newRelationship, setNewRelationship] = useState({ characterId: 0, type: '', description: '' });
    
    const [isManageModalOpen, setManageModalOpen] = useState(false);
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFieldChange = (field: keyof Character, value: any) => {
        setCharData(prev => ({...prev, [field]: value}));
    };
    
    const handleRelationshipChange = (field: keyof Omit<CharacterRelationship, 'id'>, value: any) => {
        setNewRelationship(prev => ({...prev, [field]: value}));
    };

    const handleAddRelationship = () => {
        if (!newRelationship.characterId || !newRelationship.type) return;
        const newRelation: CharacterRelationship = { ...newRelationship, id: Date.now(), characterId: Number(newRelationship.characterId) };
        handleFieldChange('relationships', [...charData.relationships, newRelation]);
        setNewRelationship({ characterId: 0, type: '', description: '' });
    };

    const handleDeleteRelationship = (id: number) => {
        handleFieldChange('relationships', charData.relationships.filter(r => r.id !== id));
    };

    const debouncedSave = useCallback(() => {
        onUpdate(charData);
    }, [charData, onUpdate]);
    useDebouncedSave(debouncedSave, 1000);
    
    useEffect(() => {
        setCharData(character);
        setActiveTab('profile');
    }, [character]);
    
    const handleFleshOut = async () => {
        setIsGeneratingText(true);
        setError(null);
        try {
            const result = await fleshOutCharacter(charData, project, 'character-flesher');
            const updatedCharData = { ...charData };
            (Object.keys(result) as Array<keyof FleshedOutCharacter>).forEach(key => {
                 if (result[key] && (!updatedCharData[key] || String(updatedCharData[key]).length < 25)) {
                    (updatedCharData as any)[key] = result[key];
                }
            });
            setCharData(updatedCharData);
        } catch(err) { 
            setError(err instanceof Error ? err.message : "Failed to generate details."); 
        } finally { 
            setIsGeneratingText(false); 
        }
    };

    const TabButton = ({label, id, icon: Icon}: {label: string, id: string, icon: React.ElementType}) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === id ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}
        >
            <Icon size={16} />
            {label}
        </button>
    )

    const otherCharacters = projectCharacters.filter(c => c.id !== character.id);

    const displayImage = charData.imageGallery.find(p => p.id === charData.displayImageId);
    const displayUrl = displayImage?.url || charData.imageGallery?.[0]?.url;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-start gap-4">
                <input
                    type="text"
                    value={charData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Character Name"
                    className="text-2xl font-bold text-gray-100 font-title bg-transparent border-b-2 border-transparent hover:border-gray-600 focus:border-blue-500 focus:outline-none -ml-2 p-2 w-full transition-colors"
                />
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded-md flex-shrink-0"><Trash2 size={18} /></button>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto">
                <div className="lg:col-span-1 space-y-4 flex flex-col">
                    <div className="relative group aspect-[3/4] rounded-lg bg-black/20 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
                       {displayUrl ? (
                           <img src={displayUrl} alt={charData.name} className="w-full h-full object-cover" />
                       ) : (
                           <div className="text-center text-gray-500 p-4">
                               <ImageIcon size={40} className="mx-auto mb-2" />
                               <p>No Portrait</p>
                           </div>
                       )}
                    </div>
                    <button onClick={() => setManageModalOpen(true)} className="w-full flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"><Palette className="mr-2" />Manage Portraits</button>
                    <button onClick={handleFleshOut} disabled={isGeneratingText} className="w-full flex justify-center items-center bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/50 font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600"><Lightbulb className="mr-2" />{isGeneratingText ? 'Generating...' : 'Flesh out with AI'}</button>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>
                <div className="lg:col-span-2 flex flex-col overflow-hidden">
                    <div className="border-b border-gray-700 flex-shrink-0">
                        <nav className="flex flex-wrap -mb-px">
                            <TabButton label="Profile" id="profile" icon={User} />
                            <TabButton label="History" id="history" icon={History} />
                            <TabButton label="Narrative & Abilities" id="narrative" icon={Telescope} />
                            <TabButton label="Connections" id="connections" icon={Link} />
                            <TabButton label="Notes" id="notes" icon={StickyNote} />
                        </nav>
                    </div>
                    <div className="py-6 space-y-4 overflow-y-auto pr-2">
                        {activeTab === 'profile' && (
                            <div className="space-y-4 animate-fade-in">
                               <MultiSelectTagInput
                                   label="Archetypes"
                                   placeholder="Add an archetype..."
                                   tags={charData.archetype}
                                   setTags={(newTags) => handleFieldChange('archetype', newTags)}
                                   suggestions={characterArchetypes}
                                   maxTags={5}
                                />
                               <DetailInput label="Aliases" placeholder="Separate with commas" value={charData.aliases.join(', ')} onChange={e => handleFieldChange('aliases', e.target.value.split(',').map(s => s.trim()))} />
                               <DetailTextarea label="Physical Description" placeholder="Appearance, clothing, key features..." value={charData.description} onChange={e => handleFieldChange('description', e.target.value)} rows={4} />
                               <DetailTextarea label="Personality Traits" placeholder="Mannerisms, habits, demeanor..." value={charData.personalityTraits} onChange={e => handleFieldChange('personalityTraits', e.target.value)} />
                               <div className="grid grid-cols-2 gap-4">
                                  <DetailTextarea label="Strengths" placeholder="Positive attributes..." value={charData.strengths} onChange={e => handleFieldChange('strengths', e.target.value)} />
                                  <DetailTextarea label="Flaws" placeholder="Weaknesses, vices..." value={charData.flaws} onChange={e => handleFieldChange('flaws', e.target.value)} />
                               </div>
                            </div>
                        )}
                         {activeTab === 'history' && (
                            <div className="space-y-4 animate-fade-in">
                               <DetailTextarea label="Backstory" placeholder="Key life events, origins..." value={charData.backstory} onChange={e => handleFieldChange('backstory', e.target.value)} rows={8} />
                               <DetailTextarea label="Fears" placeholder="Phobias, anxieties, what haunts them..." value={charData.fears} onChange={e => handleFieldChange('fears', e.target.value)} />
                               <DetailTextarea label="Secrets" placeholder="What are they hiding?" value={charData.secrets} onChange={e => handleFieldChange('secrets', e.target.value)} />
                            </div>
                        )}
                        {activeTab === 'narrative' && (
                            <div className="space-y-4 animate-fade-in">
                               <DetailTextarea label="Story Arc" placeholder="Their journey from beginning to end..." value={charData.storyArc} onChange={e => handleFieldChange('storyArc', e.target.value)} rows={4} />
                               <DetailTextarea label="Motivations" placeholder="Goals, desires, driving forces..." value={charData.motivations} onChange={e => handleFieldChange('motivations', e.target.value)} />
                               <DetailTextarea label="Internal Conflict" placeholder="The primary struggle within themselves..." value={charData.internalConflict} onChange={e => handleFieldChange('internalConflict', e.target.value)} />
                               <DetailTextarea label="Abilities & Skills" placeholder="List key abilities, one per line..." value={charData.abilities} onChange={e => handleFieldChange('abilities', e.target.value)} />
                            </div>
                        )}
                        {activeTab === 'connections' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 font-title mb-3">Add New Connection</h3>
                                    <div className="p-4 bg-black/20 rounded-lg space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <select value={newRelationship.characterId} onChange={e => handleRelationshipChange('characterId', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                                <option value={0} disabled>Select a character...</option>
                                                {otherCharacters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            <input type="text" placeholder="Relationship Type (e.g., Ally, Rival)" value={newRelationship.type} onChange={e => handleRelationshipChange('type', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <textarea placeholder="Describe the relationship..." value={newRelationship.description} onChange={e => handleRelationshipChange('description', e.target.value)} rows={3} className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-y" />
                                        <button onClick={handleAddRelationship} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center gap-2"><Plus size={16} /> Add Connection</button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 font-title mb-3">Existing Connections</h3>
                                    <div className="space-y-3">
                                        {charData.relationships.length > 0 ? charData.relationships.map(rel => {
                                            const relatedChar = projectCharacters.find(c => c.id === rel.characterId);
                                            return (
                                                <div key={rel.id} className="bg-black/20 p-3 rounded-lg">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-gray-100">{relatedChar ? relatedChar.name : 'Unknown Character'} - <span className="font-normal text-blue-400">{rel.type}</span></p>
                                                            <p className="text-gray-400 text-sm mt-1">{rel.description}</p>
                                                        </div>
                                                        <button onClick={() => handleDeleteRelationship(rel.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/30 rounded-md flex-shrink-0"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            );
                                        }) : <p className="text-gray-500">No connections defined.</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'notes' && (
                           <div className="space-y-4 animate-fade-in">
                                <DetailTextarea label="Psychological Profile" placeholder="Core psychological drivers..." value={charData.psychologicalProfile} onChange={e => handleFieldChange('psychologicalProfile', e.target.value)} rows={5} />
                                <DetailTextarea label="General Notes" placeholder="Any other details, ideas, or reminders..." value={charData.notes} onChange={e => handleFieldChange('notes', e.target.value)} rows={6} />
                           </div>
                        )}
                    </div>
                </div>
            </div>
            {isManageModalOpen && <ManagePortraitsModal character={charData} onUpdateCharacter={setCharData} onClose={() => setManageModalOpen(false)} />}
        </div>
    );
}

const CharacterCard = ({ character, isSelected, onSelect }: { character: Character, isSelected: boolean, onSelect: () => void }) => {
    const displayImage = character.imageGallery.find(p => p.id === character.displayImageId);
    const displayUrl = displayImage?.url || character.imageGallery?.[0]?.url;
    return (
        <button onClick={onSelect} className={`w-full text-left flex items-center gap-3 p-3 border-b border-gray-700/50 transition-colors ${isSelected ? 'bg-blue-900/50' : 'hover:bg-gray-800/50'}`}>
            <div className="w-12 h-12 rounded-md bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {displayUrl ? <img src={displayUrl} alt={character.name} className="w-full h-full object-cover" /> : <Users size={24} className="text-gray-500" />}
            </div>
            <p className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{character.name}</p>
        </button>
    );
}

const CharacterLibrary = ({ project, onUpdateProject, onBack, backLabel }: { project: Project; onUpdateProject: (p: Project) => void; onBack?: () => void; backLabel?: string; }) => {
    const characters = project.worldBible.characters;
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(characters.length > 0 ? characters[0].id : null);
    const [isNewCharDropdownOpen, setIsNewCharDropdownOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const newCharButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (newCharButtonRef.current && !newCharButtonRef.current.contains(event.target as Node)) {
                setIsNewCharDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateCharacter = (updatedCharacter: Character) => {
        const newCharacters = characters.map(c => c.id === updatedCharacter.id ? updatedCharacter : c);
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, characters: newCharacters } });
    };

    const addCharacter = () => {
        const newCharacter: Character = {
            id: Date.now(), name: "New Character", aliases: [], archetype: [], role: 'Supporting', imageGallery: [], modelImageUrls: [],
            description: '', personalityTraits: '', strengths: '', flaws: '', backstory: '', fears: '',
            secrets: '', motivations: '', storyArc: '', internalConflict: '', abilities: '', psychologicalProfile: '',
            relationships: [], notes: ''
        };
        const newCharacters = [...characters, newCharacter];
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, characters: newCharacters } });
        setSelectedCharacterId(newCharacter.id);
    };

    const handleGenerateCharacter = (generatedChar: GeneratedCharacter) => {
        const newCharacter: Character = {
            id: Date.now(),
            ...generatedChar,
            imageGallery: [],
            modelImageUrls: [],
            relationships: [],
            notes: '',
        };
        const newCharacters = [...characters, newCharacter];
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, characters: newCharacters } });
        setSelectedCharacterId(newCharacter.id);
    };

    const deleteCharacter = (id: number) => {
        const newCharacters = characters.filter(c => c.id !== id);
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, characters: newCharacters } });
        if(selectedCharacterId === id) {
            setSelectedCharacterId(newCharacters.length > 0 ? newCharacters[0].id : null);
        }
    };
    
    useEffect(() => {
        const currentCharacterExists = characters.some(c => c.id === selectedCharacterId);
        if (!currentCharacterExists && characters.length > 0) {
            setSelectedCharacterId(characters[0].id);
        } else if (characters.length === 0) {
            setSelectedCharacterId(null);
        }
    }, [characters, selectedCharacterId]);

    const selectedCharacter = characters.find(c => c.id === selectedCharacterId);

    return (
        <div className="flex h-full flex-col">
            {isGenerateModalOpen && <GenerateCharacterModal onClose={() => setIsGenerateModalOpen(false)} onGenerate={handleGenerateCharacter} project={project} />}
            {onBack && (
                <header className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> {backLabel || 'Back'}
                    </button>
                </header>
            )}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 max-w-xs bg-[#2D2D2D]/50 border-r border-gray-700/50 flex flex-col">
                    <div className="p-4 border-b border-gray-700/50" ref={newCharButtonRef}>
                        <div className="relative">
                            <button onClick={() => setIsNewCharDropdownOpen(p => !p)} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center gap-2">
                                <Plus size={16} /> New Character <ChevronDown size={16} className={`transition-transform ${isNewCharDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isNewCharDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-[#333333] border border-gray-600 rounded-md shadow-lg z-10 animate-fade-in">
                                    <button onClick={() => { addCharacter(); setIsNewCharDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                        <User size={16}/> Blank Character
                                    </button>
                                    <button onClick={() => { setIsGenerateModalOpen(true); setIsNewCharDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                        <Sparkles size={16}/> Generate with AI
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">{characters.map(char => <CharacterCard key={char.id} character={char} isSelected={char.id === selectedCharacterId} onSelect={() => setSelectedCharacterId(char.id)} />)}</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {selectedCharacter ? <CharacterDetail key={selectedCharacter.id} character={selectedCharacter} onUpdate={updateCharacter} onDelete={() => deleteCharacter(selectedCharacter.id)} project={project} projectCharacters={characters} /> : <div className="h-full flex items-center justify-center text-gray-500"><div className="text-center"><Users size={48} className="mx-auto mb-4" /><h3 className="text-xl font-title">No Character Selected</h3><p>Create or select a character.</p></div></div>}
                </div>
            </div>
        </div>
    );
};

// ========================================================================================
// SECTION: WORLD BIBLE - ITEM LIBRARY
// ========================================================================================

const ItemDetail = ({ item, onUpdate, onDelete, project }: { item: Item, onUpdate: (item: Item) => void, onDelete: () => void, project: Project }) => {
    const [itemData, setItemData] = useState(item);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFieldChange = (field: keyof Item, value: any) => {
        setItemData(prev => ({...prev, [field]: value}));
    };

    const debouncedSave = useCallback(() => {
        onUpdate(itemData);
    }, [itemData, onUpdate]);
    useDebouncedSave(debouncedSave, 1000);
    
    useEffect(() => {
        setItemData(item);
    }, [item]);

    const handleGenerateImage = async () => {
        if (!itemData.description) { setError("Please provide a description to generate an image."); return; }
        setIsGeneratingImage(true); setError(null);
        try {
            const imageUrl = await generateItemImage(itemData.description);
            onUpdate({ ...itemData, imageUrl: imageUrl });
        } catch (err) { setError(err instanceof Error ? err.message : "Failed to generate image."); } finally { setIsGeneratingImage(false); }
    };
    
    const handleFleshOut = async () => {
        const concept = itemData.name === "New Item" ? itemData.description : `${itemData.name}: ${itemData.description}`;
        if (!concept) { setError("Please provide a name or description."); return; }
        setIsGeneratingText(true); setError(null);
        try {
            const result = await fleshOutItem(concept, project, 'item-flesher');
            setItemData(prev => ({
                ...prev, ...result,
                description: result.description || prev.description,
            }));
        } catch(err) { setError(err instanceof Error ? err.message : "Failed to generate details."); } finally { setIsGeneratingText(false); }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-start gap-4">
                <input type="text" value={itemData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="text-2xl font-bold text-gray-100 font-title bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none -ml-2 p-2 w-full" />
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded-md flex-shrink-0"><Trash2 size={18} /></button>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                <div className="lg:col-span-1 space-y-4 flex flex-col">
                    <div className="aspect-square rounded-lg bg-black/20 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
                       {isGeneratingImage ? <div className="flex flex-col items-center text-blue-300"><Loader2 size={40} className="animate-spin" /><p className="mt-2 text-sm">Generating...</p></div> : itemData.imageUrl ? <img src={itemData.imageUrl} alt={itemData.name} className="w-full h-full object-cover" /> : <div className="text-center text-gray-500 p-4"><Sword size={40} className="mx-auto mb-2" /><p>No Image</p></div>}
                    </div>
                    <button onClick={handleGenerateImage} disabled={isGeneratingImage || !itemData.description} className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600"><Palette className="mr-2" />{isGeneratingImage ? 'Generating...' : 'Generate Image'}</button>
                    <button onClick={handleFleshOut} disabled={isGeneratingText} className="w-full flex justify-center items-center bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/50 font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600"><BrainCircuit className="mr-2" />{isGeneratingText ? 'Generating...' : 'Flesh out with AI'}</button>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>
                <div className="lg:col-span-2 flex flex-col overflow-y-auto pr-2 space-y-4">
                     <DetailInput label="Type" placeholder="e.g., Weapon, Artifact, Key Item" value={itemData.type} onChange={e => handleFieldChange('type', e.target.value)} />
                     <DetailTextarea label="Description" placeholder="Visuals, materials, key features..." value={itemData.description} onChange={e => handleFieldChange('description', e.target.value)} rows={6} />
                     <DetailTextarea label="History" placeholder="Origin, past owners, significant events..." value={itemData.history} onChange={e => handleFieldChange('history', e.target.value)} rows={5} />
                     <DetailTextarea label="Abilities" placeholder="List magical properties or functions, one per line..." value={itemData.abilities} onChange={e => handleFieldChange('abilities', e.target.value)} rows={4} />
                </div>
            </div>
        </div>
    );
};

const ItemCard = ({ item, isSelected, onSelect }: { item: Item, isSelected: boolean, onSelect: () => void }) => (
    <button onClick={onSelect} className={`w-full text-left flex items-center gap-3 p-3 border-b border-gray-700/50 transition-colors ${isSelected ? 'bg-blue-900/50' : 'hover:bg-gray-800/50'}`}>
        <div className="w-12 h-12 rounded-md bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <Sword size={24} className="text-gray-500" />}
        </div>
        <div>
            <p className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{item.name}</p>
            <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{item.type}</p>
        </div>
    </button>
);

const ItemLibrary = ({ project, onUpdateProject, onBack, backLabel }: { project: Project; onUpdateProject: (p: Project) => void; onBack?: () => void; backLabel?: string; }) => {
    const items = project.worldBible.items;
    const [selectedItemId, setSelectedItemId] = useState<number | null>(items.length > 0 ? items[0].id : null);

    const updateItem = (updatedItem: Item) => {
        const newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, items: newItems } });
    };

    const addItem = () => {
        const newItem: Item = {
            id: Date.now(), name: "New Item", type: "Artifact", description: "", imageUrl: "", history: "", abilities: ""
        };
        const newItems = [...items, newItem];
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, items: newItems } });
        setSelectedItemId(newItem.id);
    };

    const deleteItem = (id: number) => {
        const newItems = items.filter(i => i.id !== id);
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, items: newItems } });
        if(selectedItemId === id) {
            setSelectedItemId(newItems.length > 0 ? newItems[0].id : null);
        }
    };
    
    useEffect(() => {
        const currentItemExists = items.some(i => i.id === selectedItemId);
        if (!currentItemExists && items.length > 0) {
            setSelectedItemId(items[0].id);
        } else if (items.length === 0) {
            setSelectedItemId(null);
        }
    }, [items, selectedItemId]);
    
    const selectedItem = items.find(i => i.id === selectedItemId);

    return (
        <div className="flex h-full flex-col">
            {onBack && (
                <header className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> {backLabel || 'Back'}
                    </button>
                </header>
            )}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 max-w-xs bg-[#2D2D2D]/50 border-r border-gray-700/50 flex flex-col">
                    <div className="p-4 border-b border-gray-700/50"><button onClick={addItem} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center gap-2"><Plus size={16} /> New Item</button></div>
                    <div className="flex-1 overflow-y-auto">{items.map(item => <ItemCard key={item.id} item={item} isSelected={item.id === selectedItemId} onSelect={() => setSelectedItemId(item.id)} />)}</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {selectedItem ? <ItemDetail key={selectedItem.id} item={selectedItem} onUpdate={updateItem} onDelete={() => deleteItem(selectedItem.id)} project={project} /> : <div className="h-full flex items-center justify-center text-gray-500"><div className="text-center"><Sword size={48} className="mx-auto mb-4" /><h3 className="text-xl font-title">No Item Selected</h3><p>Create or select an item.</p></div></div>}
                </div>
            </div>
        </div>
    );
};

// ========================================================================================
// SECTION: WORLD BIBLE - LOCATION LIBRARY
// ========================================================================================

const ManageLocationImagesModal = ({ location, onUpdateLocation, onClose }: { location: Location; onUpdateLocation: (loc: Location) => void; onClose: () => void; }) => {
    const [stylePrompt, setStylePrompt] = useState('');
    const [engine, setEngine] = useState<'gemini' | 'midjourney' | 'openai'>('gemini');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const imageUrl = await generateLocationImage(location, stylePrompt, engine);
            const newImage: ImageAsset = { id: Date.now(), url: imageUrl };
            onUpdateLocation({ ...location, imageGallery: [...location.imageGallery, newImage] });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate image.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSetDisplayImage = (imageId: number) => {
        onUpdateLocation({ ...location, displayImageId: imageId });
    };

    const handleDelete = (imageId: number) => {
        if (location.displayImageId === imageId) {
            alert("Cannot delete the current display image. Please set another image as display first.");
            return;
        }
        onUpdateLocation({ ...location, imageGallery: location.imageGallery.filter(p => p.id !== imageId) });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                     const newImage: ImageAsset = { id: Date.now(), url: event.target.result as string };
                     onUpdateLocation({ ...location, imageGallery: [...location.imageGallery, newImage] });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleToggleModelImage = (imageUrl: string) => {
        const isSelected = location.modelImageUrls.includes(imageUrl);
        let newModelUrls = isSelected ? location.modelImageUrls.filter(url => url !== imageUrl) : [...location.modelImageUrls, imageUrl];
        if (newModelUrls.length > 10) {
            alert("You can select a maximum of 10 images for the model.");
            return;
        }
        onUpdateLocation({ ...location, modelImageUrls: newModelUrls });
    };

    const handleTrainModel = () => {
        if (location.modelImageUrls.length < 5) {
            alert("Please select at least 5 images to train the model.");
            return;
        }
        alert(`Training model for ${location.name}... (simulation)`);
        onUpdateLocation({ ...location, isModelTrained: true });
    };


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-blue-400 font-title">Manage Images for {location.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                         <div className="p-4 bg-black/20 rounded-lg space-y-4">
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">1. Generate or Upload</h3>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Engine</label>
                                <select value={engine} onChange={e => setEngine(e.target.value as any)} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="gemini">Gemini</option>
                                    <option value="midjourney">Midjourney</option>
                                    <option value="openai">OpenAI (DALL-E)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Style Prompt</label>
                                <input type="text" value={stylePrompt} onChange={(e) => setStylePrompt(e.target.value)} placeholder="e.g., epic fantasy, cinematic" className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <button onClick={handleGenerate} disabled={isGenerating} className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600">
                                {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </button>
                             <div className="flex items-center gap-2"><div className="flex-grow h-px bg-gray-700"></div><span className="text-gray-500 text-sm">OR</span><div className="flex-grow h-px bg-gray-700"></div></div>
                             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden"/>
                             <button onClick={() => fileInputRef.current?.click()} className="w-full flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"><UploadCloud className="mr-2" /> Upload Image</button>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg space-y-4">
                             <h3 className="text-lg font-semibold text-gray-300 mb-2">2. Train Model</h3>
                             <p className="text-sm text-gray-400">Select 5-10 images for a consistent visual model.</p>
                             <div className="text-center text-sm p-2 rounded-md bg-gray-800 text-gray-300">
                                {location.modelImageUrls.length} / 10 images selected
                             </div>
                             <button onClick={handleTrainModel} disabled={location.modelImageUrls.length < 5} className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed">
                                Train Location Model
                             </button>
                             {location.isModelTrained && <p className="text-green-400 text-sm flex items-center justify-center gap-2"><CheckCircle2 size={16}/> Model Trained!</p>}
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    </div>
                    <div className="lg:col-span-2">
                         <h3 className="text-lg font-semibold text-gray-300 mb-2">Image Gallery</h3>
                         {location.imageGallery.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {location.imageGallery.map(img => {
                                    const isSelected = location.modelImageUrls.includes(img.url);
                                    const isDisplay = location.displayImageId === img.id;
                                    return (
                                        <div key={img.id} className={`relative group aspect-video bg-gray-800 rounded-md overflow-hidden border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
                                            <img src={img.url} alt="Location" className="w-full h-full object-cover" />
                                            {isDisplay && <Star className="absolute top-1 left-1 w-5 h-5 text-yellow-400 fill-yellow-400" />}
                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                                                <button onClick={() => handleSetDisplayImage(img.id)} className="w-full py-1.5 text-xs rounded bg-gray-200 hover:bg-white text-black">Set as Display</button>
                                                <button onClick={() => handleToggleModelImage(img.url)} className={`w-full py-1.5 text-xs rounded ${isSelected ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-gray-200 hover:bg-white text-black'}`}>
                                                    {isSelected ? 'Deselect' : 'Select for Model'}
                                                </button>
                                                <button onClick={() => handleDelete(img.id)} className="p-2 bg-red-600/80 text-white rounded-full hover:bg-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                         ) : (
                            <div className="h-full flex items-center justify-center text-center text-gray-500 border-2 border-dashed border-gray-700 rounded-lg p-8">
                                <div><ImageIcon size={40} className="mx-auto mb-2" /><p>No images yet.</p><p className="text-sm">Generate or upload one.</p></div>
                            </div>
                         )}
                    </div>
                </div>
                 <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">Done</button>
                </div>
            </div>
        </div>
    );
};


const LocationDetail = ({ location, onUpdate, onDelete, project }: { location: Location, onUpdate: (loc: Location) => void, onDelete: () => void, project: Project }) => {
    const [locData, setLocData] = useState(location);
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isManageModalOpen, setManageModalOpen] = useState(false);

    const handleFieldChange = (field: keyof Location, value: any) => {
        setLocData(prev => ({...prev, [field]: value}));
    };

    const debouncedSave = useCallback(() => {
        onUpdate(locData);
    }, [locData, onUpdate]);
    useDebouncedSave(debouncedSave, 1000);
    
    useEffect(() => {
        setLocData(location);
    }, [location]);
    
    const handleFleshOut = async () => {
        const concept = locData.name === "New Location" ? locData.description : `${locData.name}: ${locData.description}`;
        if (!concept) { setError("Please provide a name or description."); return; }
        setIsGeneratingText(true); setError(null);
        try {
            const result = await fleshOutLocation(concept, project, 'location-flesher');
            setLocData(prev => ({ ...prev, ...result }));
        } catch(err) { setError(err instanceof Error ? err.message : "Failed to generate details."); } finally { setIsGeneratingText(false); }
    };

    const displayImage = locData.imageGallery.find(p => p.id === locData.displayImageId);
    const displayUrl = displayImage?.url || locData.imageGallery?.[0]?.url;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-start gap-4">
                <input type="text" value={locData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="text-2xl font-bold text-gray-100 font-title bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none -ml-2 p-2 w-full" />
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded-md flex-shrink-0"><Trash2 size={18} /></button>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                <div className="lg:col-span-1 space-y-4 flex flex-col">
                    <div className="aspect-video rounded-lg bg-black/20 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
                       {displayUrl ? <img src={displayUrl} alt={locData.name} className="w-full h-full object-cover" /> : <div className="text-center text-gray-500 p-4"><Map size={40} className="mx-auto mb-2" /><p>No Image</p></div>}
                    </div>
                    <button onClick={() => setManageModalOpen(true)} className="w-full flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"><Palette className="mr-2" />Manage Images</button>
                    <button onClick={handleFleshOut} disabled={isGeneratingText} className="w-full flex justify-center items-center bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/50 font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600"><BrainCircuit className="mr-2" />{isGeneratingText ? 'Generating...' : 'Flesh out with AI'}</button>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>
                <div className="lg:col-span-2 flex flex-col overflow-y-auto pr-2 space-y-4">
                     <DetailInput label="Type" placeholder="e.g., City, Planet, Building" value={locData.type} onChange={e => handleFieldChange('type', e.target.value)} />
                     <DetailTextarea label="Description" placeholder="Atmosphere, key features..." value={locData.description} onChange={e => handleFieldChange('description', e.target.value)} rows={5} />
                     <DetailTextarea label="History" placeholder="Origin story, significant events..." value={locData.history} onChange={e => handleFieldChange('history', e.target.value)} rows={4} />
                     <DetailTextarea label="Key Landmarks" placeholder="List one per line" value={locData.keyLandmarks} onChange={e => handleFieldChange('keyLandmarks', e.target.value)} rows={3} />
                     <DetailTextarea label="Governance" placeholder="How is it ruled?" value={locData.governance} onChange={e => handleFieldChange('governance', e.target.value)} />
                     <DetailTextarea label="Dominant Peoples" placeholder="Who lives here?" value={locData.dominantPeoples} onChange={e => handleFieldChange('dominantPeoples', e.target.value)} />
                     <DetailTextarea label="Post-Cataclysm Impact" placeholder="How has it changed?" value={locData.postCataclysmImpact} onChange={e => handleFieldChange('postCataclysmImpact', e.target.value)} />
                </div>
            </div>
            {isManageModalOpen && <ManageLocationImagesModal location={locData} onUpdateLocation={setLocData} onClose={() => setManageModalOpen(false)} />}
        </div>
    );
};

const LocationCard = ({ location, isSelected, onSelect }: { location: Location, isSelected: boolean, onSelect: () => void }) => {
    const displayImage = location.imageGallery.find(p => p.id === location.displayImageId);
    const displayUrl = displayImage?.url || location.imageGallery?.[0]?.url;
    return (
        <button onClick={onSelect} className={`w-full text-left flex items-center gap-3 p-3 border-b border-gray-700/50 transition-colors ${isSelected ? 'bg-blue-900/50' : 'hover:bg-gray-800/50'}`}>
            <div className="w-12 h-12 rounded-md bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {displayUrl ? <img src={displayUrl} alt={location.name} className="w-full h-full object-cover" /> : <Map size={24} className="text-gray-500" />}
            </div>
            <div>
                <p className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{location.name}</p>
                <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{location.type}</p>
            </div>
        </button>
    );
}

const LocationLibrary = ({ project, onUpdateProject, onBack, backLabel }: { project: Project; onUpdateProject: (p: Project) => void; onBack?: () => void; backLabel?: string; }) => {
    const locations = project.worldBible.locations;
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(locations.length > 0 ? locations[0].id : null);

    const updateLocation = (updatedLocation: Location) => {
        const newLocations = locations.map(l => l.id === updatedLocation.id ? updatedLocation : l);
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, locations: newLocations } });
    };

    const addLocation = () => {
        const newLocation: Location = {
            id: Date.now(), name: "New Location", type: "City", description: "", imageGallery: [], modelImageUrls: [], history: "", keyLandmarks: "", postCataclysmImpact: "", dominantPeoples: "", governance: ""
        };
        const newLocations = [...locations, newLocation];
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, locations: newLocations } });
        setSelectedLocationId(newLocation.id);
    };

    const deleteLocation = (id: number) => {
        const newLocations = locations.filter(l => l.id !== id);
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, locations: newLocations } });
        if(selectedLocationId === id) {
            setSelectedLocationId(newLocations.length > 0 ? newLocations[0].id : null);
        }
    };
    
    useEffect(() => {
        const currentExists = locations.some(l => l.id === selectedLocationId);
        if (!currentExists && locations.length > 0) {
            setSelectedLocationId(locations[0].id);
        } else if (locations.length === 0) {
            setSelectedLocationId(null);
        }
    }, [locations, selectedLocationId]);
    
    const selectedLocation = locations.find(l => l.id === selectedLocationId);

    return (
        <div className="flex h-full flex-col">
            {onBack && (
                <header className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> {backLabel || 'Back'}
                    </button>
                </header>
            )}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 max-w-xs bg-[#2D2D2D]/50 border-r border-gray-700/50 flex flex-col">
                    <div className="p-4 border-b border-gray-700/50"><button onClick={addLocation} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center gap-2"><Plus size={16} /> New Location</button></div>
                    <div className="flex-1 overflow-y-auto">{locations.map(loc => <LocationCard key={loc.id} location={loc} isSelected={loc.id === selectedLocationId} onSelect={() => setSelectedLocationId(loc.id)} />)}</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {selectedLocation ? <LocationDetail key={selectedLocation.id} location={selectedLocation} onUpdate={updateLocation} onDelete={() => deleteLocation(selectedLocation.id)} project={project} /> : <div className="h-full flex items-center justify-center text-gray-500"><div className="text-center"><Map size={48} className="mx-auto mb-4" /><h3 className="text-xl font-title">No Location Selected</h3><p>Create or select a location.</p></div></div>}
                </div>
            </div>
        </div>
    );
};

// ========================================================================================
// SECTION: WORLD BIBLE - FACTION LIBRARY
// ========================================================================================

const FactionDetail = ({ faction, onUpdate, onDelete, allFactions, project }: { faction: Faction, onUpdate: (fac: Faction) => void, onDelete: () => void, allFactions: Faction[], project: Project }) => {
    const [facData, setFacData] = useState(faction);
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFieldChange = (field: keyof Faction, value: any) => {
        setFacData(prev => ({...prev, [field]: value}));
    };
    
    const handleMultiSelectChange = (field: 'allies' | 'enemies', selectedIds: number[]) => {
        setFacData(prev => ({ ...prev, [field]: selectedIds }));
    };

    const debouncedSave = useCallback(() => {
        onUpdate(facData);
    }, [facData, onUpdate]);
    useDebouncedSave(debouncedSave, 1000);
    
    useEffect(() => {
        setFacData(faction);
    }, [faction]);

    const handleFleshOut = async () => {
        const concept = facData.name === "New Faction" ? facData.description : `${facData.name}: ${facData.description}`;
        if (!concept) { setError("Please provide a name or description."); return; }
        setIsGeneratingText(true); setError(null);
        try {
            const result = await fleshOutFaction(concept, project, 'faction-flesher');
            setFacData(prev => ({ ...prev, ...result }));
        } catch(err) { setError(err instanceof Error ? err.message : "Failed to generate details."); } finally { setIsGeneratingText(false); }
    };
    
    const otherFactions = allFactions.filter(f => f.id !== faction.id);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-start gap-4">
                <input type="text" value={facData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="text-2xl font-bold text-gray-100 font-title bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none -ml-2 p-2 w-full" />
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded-md flex-shrink-0"><Trash2 size={18} /></button>
            </div>
             <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                    <button onClick={handleFleshOut} disabled={isGeneratingText} className="w-full flex justify-center items-center bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/50 font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600"><BrainCircuit className="mr-2" />{isGeneratingText ? 'Generating...' : 'Flesh out with AI'}</button>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <DetailInput label="Type" placeholder="e.g., Guild, Kingdom, Corporation" value={facData.type} onChange={e => handleFieldChange('type', e.target.value)} />
                    <DetailTextarea label="Description" placeholder="Overview of the faction..." value={facData.description} onChange={e => handleFieldChange('description', e.target.value)} rows={4} />
                    <DetailTextarea label="Ideology" placeholder="Beliefs, values, philosophy..." value={facData.ideology} onChange={e => handleFieldChange('ideology', e.target.value)} />
                    <DetailTextarea label="Goals" placeholder="What they want to achieve..." value={facData.goals} onChange={e => handleFieldChange('goals', e.target.value)} />
                    <DetailTextarea label="Leadership" placeholder="Who is in charge?" value={facData.leadership} onChange={e => handleFieldChange('leadership', e.target.value)} />
                    <DetailTextarea label="Methods" placeholder="How do they operate?" value={facData.methods} onChange={e => handleFieldChange('methods', e.target.value)} />
                    <DetailTextarea label="Strongholds" placeholder="Where are they based?" value={facData.strongholds} onChange={e => handleFieldChange('strongholds', e.target.value)} />
                    <DetailTextarea label="Impact on World" placeholder="Their effect on the setting..." value={facData.impactOnWorld} onChange={e => handleFieldChange('impactOnWorld', e.target.value)} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-1.5 block">Allies</label>
                            <select multiple value={facData.allies.map(String)} onChange={e => handleMultiSelectChange('allies', Array.from(e.target.selectedOptions, option => Number(option.value)))} className="w-full h-32 bg-[#2D2D2D] border border-gray-700/50 rounded-lg p-2 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                                {otherFactions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-400 mb-1.5 block">Enemies</label>
                            <select multiple value={facData.enemies.map(String)} onChange={e => handleMultiSelectChange('enemies', Array.from(e.target.selectedOptions, option => Number(option.value)))} className="w-full h-32 bg-[#2D2D2D] border border-gray-700/50 rounded-lg p-2 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                                {otherFactions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FactionCard = ({ faction, isSelected, onSelect }: { faction: Faction, isSelected: boolean, onSelect: () => void }) => (
    <button onClick={onSelect} className={`w-full text-left flex items-center gap-3 p-3 border-b border-gray-700/50 transition-colors ${isSelected ? 'bg-blue-900/50' : 'hover:bg-gray-800/50'}`}>
        <div className="w-12 h-12 rounded-md bg-gray-700 flex-shrink-0 flex items-center justify-center"><Castle size={24} className="text-gray-500" /></div>
        <div>
            <p className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{faction.name}</p>
            <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{faction.type}</p>
        </div>
    </button>
);

const FactionLibrary = ({ project, onUpdateProject, onBack, backLabel }: { project: Project; onUpdateProject: (p: Project) => void; onBack?: () => void; backLabel?: string; }) => {
    const factions = project.worldBible.factions;
    const [selectedFactionId, setSelectedFactionId] = useState<number | null>(factions.length > 0 ? factions[0].id : null);

    const updateFaction = (updatedFaction: Faction) => {
        const newFactions = factions.map(f => f.id === updatedFaction.id ? updatedFaction : f);
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, factions: newFactions } });
    };

    const addFaction = () => {
        const newFaction: Faction = {
            id: Date.now(), name: "New Faction", type: "Guild", description: "", ideology: "", leadership: "", methods: "", strongholds: "", impactOnWorld: "", goals: "", allies: [], enemies: []
        };
        const newFactions = [...factions, newFaction];
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, factions: newFactions } });
        setSelectedFactionId(newFaction.id);
    };

    const deleteFaction = (id: number) => {
        const newFactions = factions.filter(f => f.id !== id);
        onUpdateProject({ ...project, worldBible: { ...project.worldBible, factions: newFactions } });
        if(selectedFactionId === id) {
            setSelectedFactionId(newFactions.length > 0 ? newFactions[0].id : null);
        }
    };
    
    useEffect(() => {
        const currentExists = factions.some(f => f.id === selectedFactionId);
        if (!currentExists && factions.length > 0) {
            setSelectedFactionId(factions[0].id);
        } else if (factions.length === 0) {
            setSelectedFactionId(null);
        }
    }, [factions, selectedFactionId]);
    
    const selectedFaction = factions.find(f => f.id === selectedFactionId);

    return (
        <div className="flex h-full flex-col">
            {onBack && (
                <header className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> {backLabel || 'Back'}
                    </button>
                </header>
            )}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 max-w-xs bg-[#2D2D2D]/50 border-r border-gray-700/50 flex flex-col">
                    <div className="p-4 border-b border-gray-700/50"><button onClick={addFaction} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center gap-2"><Plus size={16} /> New Faction</button></div>
                    <div className="flex-1 overflow-y-auto">{factions.map(fac => <FactionCard key={fac.id} faction={fac} isSelected={fac.id === selectedFactionId} onSelect={() => setSelectedFactionId(fac.id)} />)}</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {selectedFaction ? <FactionDetail key={selectedFaction.id} faction={selectedFaction} onUpdate={updateFaction} onDelete={() => deleteFaction(selectedFaction.id)} allFactions={factions} project={project} /> : <div className="h-full flex items-center justify-center text-gray-500"><div className="text-center"><Castle size={48} className="mx-auto mb-4" /><h3 className="text-xl font-title">No Faction Selected</h3><p>Create or select a faction.</p></div></div>}
                </div>
            </div>
        </div>
    );
};

// ========================================================================================
// SECTION: DOCUMENT LIBRARY
// ========================================================================================

const DocumentDetail = ({ doc, onUpdate, onDelete }: { doc: ProseDocument, onUpdate: (doc: any) => void, onDelete: () => void }) => {
    const [docData, setDocData] = useState(doc);

    const handleFieldChange = (field: keyof ProseDocument, value: string) => {
        setDocData(prev => ({ ...prev, [field]: value }));
    };

    const debouncedSave = useCallback(() => {
        onUpdate(docData);
    }, [docData, onUpdate]);

    useDebouncedSave(debouncedSave, 1000);

    useEffect(() => {
        setDocData(doc);
    }, [doc]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center gap-4 flex-shrink-0">
                <input type="text" value={docData.fileName} onChange={e => handleFieldChange('fileName', e.target.value)} className="text-xl font-bold text-gray-100 font-title bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none -ml-2 p-2 w-full" />
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded-md flex-shrink-0"><Trash2 size={18} /></button>
            </div>
            <textarea value={docData.content} onChange={e => handleFieldChange('content', e.target.value)} placeholder="Document content..." className="flex-grow w-full bg-[#2D2D2D] border border-gray-700/50 rounded-lg p-3 text-gray-200 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono" />
        </div>
    );
};

const DocumentCard = ({ doc, isSelected, onSelect, icon: Icon }: { doc: ProseDocument, isSelected: boolean, onSelect: () => void, icon: React.ElementType }) => (
    <button onClick={onSelect} className={`w-full text-left flex items-center gap-3 p-3 border-b border-gray-700/50 transition-colors ${isSelected ? 'bg-blue-900/50' : 'hover:bg-gray-800/50'}`}>
        <Icon className={`w-6 h-6 flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-gray-500'}`} />
        <p className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{doc.fileName}</p>
    </button>
);

const DocumentLibrary = ({ project, onUpdateProject }: { project: Project, onUpdateProject: (p: Project) => void }) => {
    const docs = project.proseDocuments;
    const [selectedDocId, setSelectedDocId] = useState<number | null>(docs.length > 0 ? docs[0].id : null);
    const [isParsing, setIsParsing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { title, icon, noun } = { title: "Inspirational Prose Style", icon: BookText, noun: "Document" };

    const updateDocs = (newDocs: ProseDocument[]) => {
        onUpdateProject({ ...project, proseDocuments: newDocs });
    };

    const addDoc = () => {
        const newDoc = {
            id: Date.now(),
            fileName: `New ${noun}.txt`,
            content: ""
        };
        const newDocs = [...docs, newDoc];
        updateDocs(newDocs);
        setSelectedDocId(newDoc.id);
    };

    const updateDoc = (updatedDoc: ProseDocument) => {
        const newDocs = docs.map(d => d.id === updatedDoc.id ? updatedDoc : d);
        updateDocs(newDocs);
    };

    const deleteDoc = (id: number) => {
        const newDocs = docs.filter(d => d.id !== id);
        updateDocs(newDocs);
        if (selectedDocId === id) {
            setSelectedDocId(newDocs.length > 0 ? newDocs[0].id : null);
        }
    };
    
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        setIsParsing(true);
        try {
            const content = await readFileContent(file);
            const newDoc: ProseDocument = { id: Date.now(), fileName: file.name, content };
            const newDocs = [...docs, newDoc];
            updateDocs(newDocs);
            setSelectedDocId(newDoc.id);
        } catch (err) {
            console.error("Error parsing file:", err);
            alert(`Failed to parse ${file.name}. It might be corrupted or in an unsupported format.`);
        } finally {
            setIsParsing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        const currentDocExists = docs.some(d => d.id === selectedDocId);
        if (!currentDocExists && docs.length > 0) {
            setSelectedDocId(docs[0].id);
        } else if (docs.length === 0) {
            setSelectedDocId(null);
        }
    }, [docs, selectedDocId]);

    const selectedDoc = docs.find(d => d.id === selectedDocId);

    return (
        <div className="flex h-full flex-col">
            <header className="p-4 border-b border-gray-700/50 flex-shrink-0">
                 <h2 className="text-2xl font-bold text-gray-100 font-title">{title}</h2>
                 <p className="text-gray-400 text-sm">Upload documents to help the AI emulate a specific prose style.</p>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 max-w-xs bg-[#2D2D2D]/50 border-r border-gray-700/50 flex flex-col">
                    <div className="p-4 border-b border-gray-700/50 space-y-2">
                        <button onClick={addDoc} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center gap-2"><Plus size={16} /> New Blank Document</button>
                        <input type="file" accept=".txt,.pdf,.docx" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} disabled={isParsing} className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-wait">
                           {isParsing ? <><Loader2 className="mr-2 animate-spin" />Parsing...</> : <><UploadCloud className="mr-2" />Upload Document</>}
                        </button>
                        <p className="text-xs text-gray-500 text-center pt-1">Supports .txt, .pdf, and .docx files.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">{docs.map(doc => <DocumentCard key={doc.id} doc={doc} isSelected={doc.id === selectedDocId} onSelect={() => setSelectedDocId(doc.id)} icon={icon} />)}</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {selectedDoc ? <DocumentDetail key={selectedDoc.id} doc={selectedDoc} onUpdate={updateDoc} onDelete={() => deleteDoc(selectedDoc.id)} /> : <div className="h-full flex items-center justify-center text-gray-500"><div className="text-center"><div className="w-24 h-24 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-700"><FileText size={48} /></div><h3 className="text-xl font-title">No Document Selected</h3><p>Create, upload, or select a document.</p></div></div>}
                </div>
            </div>
        </div>
    );
};


// ========================================================================================
// SECTION: AI CRAFT KNOWLEDGE VIEW
// ========================================================================================

const ToolCraftAccordion = ({ tool, project, onUpdateProject, onToggleConfig }: { tool: { id: string; label: string; }, project: Project, onUpdateProject: (p: Project) => void, onToggleConfig: (toolId: string, bookId: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const configuredBooks = project.aiCraftConfig[tool.id] || [];
    const areAllEnabled = BUILT_IN_CRAFT_KNOWLEDGE.length > 0 && BUILT_IN_CRAFT_KNOWLEDGE.length === configuredBooks.length;

    const handleToggleAll = () => {
        let newConfigForTool: string[];
        if (areAllEnabled) {
            newConfigForTool = []; // Turn all off
        } else {
            newConfigForTool = BUILT_IN_CRAFT_KNOWLEDGE.map(book => book.id); // Turn all on
        }
        onUpdateProject({
            ...project,
            aiCraftConfig: { ...project.aiCraftConfig, [tool.id]: newConfigForTool }
        });
    };

    return (
        <div className="bg-black/20 border border-gray-700/50 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
                aria-expanded={isOpen}
            >
                <h4 className="text-lg font-semibold text-gray-200">{tool.label}</h4>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 border-t border-gray-700/50 animate-fade-in">
                     <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-md my-4">
                        <label htmlFor={`toggle-all-${tool.id}`} className="font-semibold text-gray-300 text-sm">Toggle All On/Off</label>
                        <button
                            id={`toggle-all-${tool.id}`}
                            onClick={handleToggleAll}
                            className={`relative w-12 h-6 flex items-center rounded-full px-1 cursor-pointer transition-colors ${areAllEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                            aria-pressed={areAllEnabled}
                        >
                            <span className="sr-only">{areAllEnabled ? 'All enabled' : 'Some or none enabled'}</span>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${areAllEnabled ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {BUILT_IN_CRAFT_KNOWLEDGE.map(book => {
                            const isEnabled = configuredBooks.includes(book.id);
                            return (
                                <div key={book.id} className="flex items-center justify-between bg-[#2D2D2D] p-4 rounded-md">
                                    <div>
                                        <h5 className="font-semibold text-gray-100">{book.title}</h5>
                                        <p className="text-sm text-gray-400 max-w-xl">{book.description}</p>
                                    </div>
                                    <button
                                        onClick={() => onToggleConfig(tool.id, book.id)}
                                        className={`relative w-12 h-6 flex-shrink-0 items-center rounded-full px-1 cursor-pointer transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                                        aria-pressed={isEnabled}
                                        aria-label={`Toggle ${book.title} for ${tool.label}`}
                                    >
                                        <span className="sr-only">{isEnabled ? 'Enabled' : 'Disabled'}</span>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isEnabled ? 'translate-x-6' : ''}`} />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const PRESETS_STORAGE_KEY = 'mythos-weaver-ai-craft-presets';

const SavePresetModal = ({ onClose, onSave, existingNames }: { onClose: () => void, onSave: (name: string) => void, existingNames: string[] }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Preset name cannot be empty.');
            return;
        }
        if (existingNames.includes(name.trim())) {
            if (!window.confirm(`A preset named "${name.trim()}" already exists. Do you want to overwrite it?`)) {
                return;
            }
        }
        onSave(name.trim());
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-blue-400 font-title mb-4">Save Configuration Preset</h2>
                        <label htmlFor="preset-name" className="block text-sm font-medium text-gray-300 mb-2">Preset Name</label>
                        <input id="preset-name" ref={inputRef} type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }} className="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>
                    <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">Save Preset</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManagePresetsModal = ({ onClose, presets, onDelete }: { onClose: () => void, presets: AICraftPreset[], onDelete: (name: string) => void }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-[#2D2D2D] border border-gray-700 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-400 font-title mb-4">Manage Custom Presets</h2>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {presets.length > 0 ? presets.map(p => (
                        <div key={p.name} className="flex justify-between items-center bg-black/20 p-3 rounded-md">
                            <span className="text-gray-200">{p.name}</span>
                            <button onClick={() => onDelete(p.name)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/30 rounded-md flex-shrink-0"><Trash2 size={16} /></button>
                        </div>
                    )) : <p className="text-gray-500 text-center">No custom presets saved.</p>}
                </div>
            </div>
             <div className="p-4 bg-black/20 border-t border-gray-700/50 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">Done</button>
            </div>
        </div>
    </div>
);


const AICraftConfigView = ({ project, onUpdateProject }: { project: Project, onUpdateProject: (p: Project) => void }) => {
    const [presets, setPresets] = useState<AICraftPreset[]>([]);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    useEffect(() => {
        const savedJSON = localStorage.getItem(PRESETS_STORAGE_KEY);
        const savedPresets = savedJSON ? JSON.parse(savedJSON) : [];
        setPresets(savedPresets);
    }, []);

    const handleToggleConfig = (toolId: string, bookId: string) => {
        const currentConfig = project.aiCraftConfig[toolId] || [];
        const isEnabled = currentConfig.includes(bookId);
        let newConfigForTool = isEnabled ? currentConfig.filter(id => id !== bookId) : [...currentConfig, bookId];
        onUpdateProject({ ...project, aiCraftConfig: { ...project.aiCraftConfig, [toolId]: newConfigForTool } });
    };

    const handleSavePreset = (name: string) => {
        const newPreset: AICraftPreset = { name, config: project.aiCraftConfig };
        const otherPresets = presets.filter(p => p.name !== name);
        const updatedPresets = [...otherPresets, newPreset].sort((a,b) => a.name.localeCompare(b.name));
        setPresets(updatedPresets);
        localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    };

    const handleDeletePreset = (name: string) => {
        const updatedPresets = presets.filter(p => p.name !== name);
        setPresets(updatedPresets);
        localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    }

    const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetName = e.target.value;
        if (presetName === 'custom') return;
        
        const allPresets: AICraftPreset[] = [
            { name: 'All On', config: ALL_ON_AI_CRAFT_CONFIG },
            { name: 'All Off', config: ALL_OFF_AI_CRAFT_CONFIG },
            ...presets
        ];
        
        const selectedPreset = allPresets.find(p => p.name === presetName);
        if (selectedPreset) {
            onUpdateProject({ ...project, aiCraftConfig: selectedPreset.config });
        }
    };
    
    const areConfigsEqual = (configA: AICraftConfig, configB: AICraftConfig): boolean => {
        const keysA = Object.keys(configA);
        const keysB = Object.keys(configB);
        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!keysB.includes(key)) return false;
            const arrA = [...configA[key]].sort();
            const arrB = [...configB[key]].sort();
            if (arrA.length !== arrB.length || arrA.some((val, i) => val !== arrB[i])) return false;
        }
        return true;
    };

    const getActivePresetName = () => {
        const fullPresetList: AICraftPreset[] = [
            { name: 'All On', config: ALL_ON_AI_CRAFT_CONFIG },
            { name: 'All Off', config: ALL_OFF_AI_CRAFT_CONFIG },
            ...presets
        ];
        const activePreset = fullPresetList.find(p => areConfigsEqual(p.config, project.aiCraftConfig));
        return activePreset ? activePreset.name : 'custom';
    };

    const activePresetName = getActivePresetName();
    const allPresetsForDropdown = [
        { name: 'All On', config: ALL_ON_AI_CRAFT_CONFIG },
        { name: 'All Off', config: ALL_OFF_AI_CRAFT_CONFIG },
        ...presets
    ];

    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            <header className="mb-6">
                <h2 className="text-3xl font-bold text-gray-100 font-title">AI Craft Knowledge</h2>
                <p className="text-gray-400 mt-2 max-w-3xl">Enable built-in writing craft modules for specific AI tools. When a module is enabled, its principles will guide the AI's generation for that tool.</p>
            </header>
            
            <div className="mb-8 p-4 bg-black/20 border border-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-200 font-title mb-3">Configuration Presets</h3>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-grow min-w-[200px]">
                        <label htmlFor="preset-select" className="sr-only">Select Preset</label>
                        <select id="preset-select" value={activePresetName} onChange={handleSelectPreset} className="w-full appearance-none bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                            {activePresetName === 'custom' && <option value="custom">Custom Configuration</option>}
                            {allPresetsForDropdown.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <button onClick={() => setIsSaveModalOpen(true)} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">Save as Preset...</button>
                    <button onClick={() => setIsManageModalOpen(true)} className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md">Manage...</button>
                </div>
            </div>

            <div className="space-y-6">
                 <h3 className="text-xl font-semibold text-blue-400 font-title">Tool Configuration</h3>
                 <div className="space-y-4">
                    {AI_CONFIGURABLE_TOOLS.map(tool => (
                        <ToolCraftAccordion
                            key={tool.id}
                            tool={tool}
                            project={project}
                            onUpdateProject={onUpdateProject}
                            onToggleConfig={handleToggleConfig}
                        />
                    ))}
                 </div>
            </div>
            {isSaveModalOpen && <SavePresetModal onClose={() => setIsSaveModalOpen(false)} onSave={handleSavePreset} existingNames={presets.map(p => p.name)} />}
            {isManageModalOpen && <ManagePresetsModal onClose={() => setIsManageModalOpen(false)} presets={presets} onDelete={handleDeletePreset} />}
        </div>
    );
};

// ========================================================================================
// SECTION: WORLD BIBLE HUB
// ========================================================================================

const CategoryAccordion = ({ project, category, setActiveTool }: { project: Project, category: SidebarItem, setActiveTool: (toolId: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = iconMap[category.icon] || FileText;

    const getCategoryData = () => {
        switch(category.toolId) {
            case 'characters': return project.worldBible.characters;
            case 'locations': return project.worldBible.locations;
            case 'factions': return project.worldBible.factions;
            case 'items': return project.worldBible.items;
            default: return [];
        }
    }
    const data = getCategoryData();

    return (
        <div className="bg-[#2D2D2D]/80 border border-gray-700/50 rounded-lg">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left group"
            >
                <div className="flex items-center">
                    <Icon className="text-blue-400 mr-4" size={24} />
                    <h3 className="text-xl font-semibold text-gray-100 font-title">{category.label}</h3>
                </div>
                <ChevronRight size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-700/50 animate-fade-in">
                    <div className="space-y-2 mb-4">
                        {data.length > 0 ? data.slice(0, 5).map((item: any) => (
                            <div key={item.id} className="p-2 bg-black/20 rounded-md">
                                <p className="text-gray-200">{item.name}</p>
                            </div>
                        )) : <p className="text-gray-500">No items yet.</p>}
                        {data.length > 5 && <p className="text-gray-500 text-sm">...and {data.length - 5} more.</p>}
                    </div>
                    <button onClick={() => setActiveTool(category.toolId)} className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-semibold rounded-md flex items-center justify-center gap-2">
                        Manage {category.label}
                    </button>
                </div>
            )}
        </div>
    );
};


const WorldBibleHub = ({ project, setActiveTool }: { project: Project, setActiveTool: (toolId: string) => void }) => {
    const worldBibleConfig = project.sidebarConfig.find(item => item.id === 'world-bible');
    const categories = worldBibleConfig?.children?.filter(child => child.isVisible) || [];

    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-100 font-title">World Bible</h2>
                <p className="text-gray-400 mt-2">Explore the foundational elements of your story's universe.</p>
            </div>
            <div className="space-y-4">
                {categories.map(category => (
                    <CategoryAccordion 
                        key={category.id}
                        project={project}
                        category={category}
                        setActiveTool={setActiveTool}
                    />
                ))}
            </div>
        </div>
    );
};

// ========================================================================================
// SECTION: MAIN PROJECT DASHBOARD
// ========================================================================================

function findItemByToolId(items: SidebarItem[], toolId: string): SidebarItem | null {
    for (const item of items) {
        if (item.toolId === toolId) return item;
        if (item.children) {
            const found = findItemByToolId(item.children, toolId);
            if (found) return found;
        }
    }
    return null;
}

const SaveStatusIndicator = ({ status }: { status: 'saved' | 'saving' }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Always become visible when status changes
        let timer: number;
        if (status === 'saved') {
            timer = window.setTimeout(() => setVisible(false), 2000);
        }
        return () => clearTimeout(timer);
    }, [status]);
    
    if (!visible && status === 'saved') return null;

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 transition-opacity duration-300 animate-fade-in">
            {status === 'saving' ? (
                <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                </>
            ) : (
                <>
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>All changes saved</span>
                </>
            )}
        </div>
    );
};

export const ProjectDashboard = ({ project, onBack, onUpdateProject, onOpenModal }: { project: Project, onBack: () => void, onUpdateProject: (p: Project) => void, onOpenModal: (modal: { type: string; project: Project | null }) => void; }) => {
    const [activeTool, setActiveTool] = useState('world-bible');
    const [isEditingWorldBible, setIsEditingWorldBible] = useState(false);
    const [isBrainMenuOpen, setIsBrainMenuOpen] = useState(false);
    const brainMenuRef = useRef<HTMLDivElement>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
    const saveTimerRef = useRef<number>();

    const handleUpdateProjectWithStatus = (updatedProject: Project) => {
        onUpdateProject(updatedProject);
        setSaveStatus('saving');
        
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = window.setTimeout(() => {
            setSaveStatus('saved');
        }, 1500);
    };
    
    useEffect(() => {
        return () => {
            if(saveTimerRef.current) clearTimeout(saveTimerRef.current);
        }
    }, []);

    const handleSidebarChange = (newItems: SidebarItem[]) => handleUpdateProjectWithStatus({ ...project, sidebarConfig: newItems });
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (brainMenuRef.current && !brainMenuRef.current.contains(event.target as Node)) {
                setIsBrainMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const worldBibleConfig = project.sidebarConfig.find(item => item.id === 'world-bible');
    const isWorldBibleTool = worldBibleConfig?.children?.some(child => child.toolId === activeTool);

    const handleBackToWorldBible = () => setActiveTool('world-bible');

    const renderTool = () => {
        const item = findItemByToolId(project.sidebarConfig, activeTool);
        const placeholder = <ToolPlaceholder name={item ? item.label : "Coming Soon"} onBack={isWorldBibleTool ? handleBackToWorldBible : undefined} backLabel="Back to World Bible" />;

        switch(activeTool) {
            case 'outline': return <OutlineView project={project} onUpdateProject={handleUpdateProjectWithStatus} />;
            case 'manuscript': return <ManuscriptView project={project} onUpdateProject={handleUpdateProjectWithStatus} />;
            case 'world-bible': return <WorldBibleHub project={project} setActiveTool={setActiveTool} />;
            case 'characters': return <CharacterLibrary project={project} onUpdateProject={handleUpdateProjectWithStatus} onBack={handleBackToWorldBible} backLabel="Back to World Bible" />;
            case 'locations': return <LocationLibrary project={project} onUpdateProject={handleUpdateProjectWithStatus} onBack={handleBackToWorldBible} backLabel="Back to World Bible" />;
            case 'factions': return <FactionLibrary project={project} onUpdateProject={handleUpdateProjectWithStatus} onBack={handleBackToWorldBible} backLabel="Back to World Bible" />;
            case 'items': return <ItemLibrary project={project} onUpdateProject={handleUpdateProjectWithStatus} onBack={handleBackToWorldBible} backLabel="Back to World Bible" />;
            case 'prose': return <DocumentLibrary project={project} onUpdateProject={handleUpdateProjectWithStatus} />;
            case 'ai-craft-config': return <AICraftConfigView project={project} onUpdateProject={handleUpdateProjectWithStatus} />;
            
            case 'magic': case 'timeline': case 'bestiary': case 'languages': case 'cultures':
            case 'storyboard': case 'scoring': case 'previs': case 'prophecies': case 'themes': case 'organizations':
                return placeholder;
            default:
                 // Handle custom items if they exist
                if(activeTool.startsWith('custom-')) return placeholder;
                return placeholder;
        }
    };
    
    return (
        <div className="flex h-screen animate-fade-in">
            <aside className="w-64 bg-[#2D2D2D] border-r border-gray-700/50 p-4 flex flex-col">
                <div className="mb-8">
                     <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-100 font-title truncate">{project.name}</h2>
                     </div>
                    <button onClick={onBack} className="text-sm flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ArrowLeft size={14} /> All Projects</button>
                    <div className="h-5 mt-1">
                        <SaveStatusIndicator status={saveStatus} />
                    </div>
                </div>
                <Sidebar items={project.sidebarConfig} setItems={handleSidebarChange} isEditing={isEditingWorldBible} activeTool={activeTool} setActiveTool={setActiveTool} />
                 <div className="mt-auto pt-4 border-t border-gray-700/50 space-y-2">
                    <button onClick={() => onOpenModal({ type: 'importManuscript', project: project })} className="flex items-center w-full p-3 rounded-lg text-left transition-colors text-gray-400 hover:bg-gray-800/50 hover:text-white">
                        <BookUp size={20} className="mr-3" />
                        <span>Upload Manuscript</span>
                    </button>
                    <button onClick={() => setIsImportModalOpen(true)} className="flex items-center w-full p-3 rounded-lg text-left transition-colors text-gray-400 hover:bg-gray-800/50 hover:text-white">
                        <FileUp size={20} className="mr-3" />
                        <span>Import World Bible</span>
                    </button>
                    <div className="relative" ref={brainMenuRef}>
                        {isBrainMenuOpen && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 w-full bg-[#383838] border border-gray-600 rounded-lg shadow-2xl z-20 animate-fade-in divide-y divide-gray-600">
                                <button onClick={() => { setActiveTool('prose'); setIsBrainMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50">
                                    <BookText size={18}/> Inspirational Prose Style
                                </button>
                                <button onClick={() => { setActiveTool('ai-craft-config'); setIsBrainMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50">
                                    <DraftingCompass size={18}/> Manage Craft Knowledge
                                </button>
                            </div>
                        )}
                        <button onClick={() => setIsBrainMenuOpen(!isBrainMenuOpen)} className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors ${isBrainMenuOpen ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>
                            <div className="flex items-center gap-3"><BrainCircuit size={20} /><span>AI Settings</span></div>
                            <ChevronDown size={16} className={`transition-transform ${isBrainMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    <button onClick={() => setIsEditingWorldBible(!isEditingWorldBible)} className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${isEditingWorldBible ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>
                        <Cog size={20} className="mr-3" />
                        <span>{isEditingWorldBible ? 'Done Editing' : 'Edit World Bible Nav'}</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 bg-[#1E1E1E] flex flex-col">
                {renderTool()}
            </main>
            {isImportModalOpen && <ImportWorldBibleModal project={project} onClose={() => setIsImportModalOpen(false)} onUpdateProject={handleUpdateProjectWithStatus} />}
        </div>
    );
};