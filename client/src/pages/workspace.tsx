import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    ArrowLeft, Plus, Cog, Trash2, Grip, ChevronRight, FileText, Bot, Users, Palette, Loader2, BrainCircuit, BookOpen, Scroll, User, History, StickyNote, Telescope, Map, Flag, Castle, Eye, Binary, Link, Edit, Sword, Sparkles, ChevronDown, X, UploadCloud, CheckCircle2, Image as ImageIcon, Star, BookText, DraftingCompass, FileUp, BookUp, AlertTriangle, Lightbulb, MapPin, Settings, PenTool, FolderPlus
} from 'lucide-react';
import { useDebouncedSave } from '../lib/useDebouncedSave';
import { 
    generateNewCharacter, fleshOutCharacter, generateCharacterImage, 
    fleshOutItem, generateItemImage, 
    generateLocationImage, fleshOutLocation,
    fleshOutFaction, getAICoachFeedback
} from '../lib/services';
import { iconMap, AI_CONFIGURABLE_TOOLS, characterArchetypes, BUILT_IN_CRAFT_KNOWLEDGE, ALL_ON_AI_CRAFT_CONFIG, ALL_OFF_AI_CRAFT_CONFIG } from '../lib/config';
import type { Project, SidebarItem, OutlineNode, Character, Location, Faction, CharacterRelationship, Item, GeneratedCharacter, FleshedOutCharacter, ImageAsset, ProseDocument, AICoachFeedback, AICraftConfig, AICraftPreset } from '../lib/types';
import { readFileContent } from '../lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Sample project data for demo purposes
const initialProject: Project = {
  id: '1',
  name: 'The Shadow Chronicles',
  type: 'novel',
  description: 'A dark fantasy epic about ancient magic and forgotten realms',
  genre: ['Fantasy', 'Adventure'],
  createdAt: new Date(),
  lastModified: new Date(),
  manuscript: {
    novel: '',
    screenplay: ''
  },
  outline: [],
  characters: [],
  locations: [],
  factions: [],
  items: [],
  proseDocuments: [],
  settings: {
    aiCraftConfig: BUILT_IN_CRAFT_KNOWLEDGE
  }
};

const initialSidebarItems: SidebarItem[] = [
  {
    id: 'manuscript',
    label: 'Manuscript',
    icon: 'file-text',
    toolId: 'manuscript',
    isVisible: true
  },
  {
    id: 'outline',
    label: 'Outline',
    icon: 'list',
    toolId: 'outline',
    isVisible: true
  },
  {
    id: 'world-bible',
    label: 'World Bible',
    icon: 'book-open',
    toolId: 'world-bible',
    isVisible: true,
    children: [
      {
        id: 'characters',
        label: 'Characters',
        icon: 'users',
        toolId: 'characters',
        isVisible: true
      },
      {
        id: 'locations',
        label: 'Locations',
        icon: 'map-pin',
        toolId: 'locations',
        isVisible: true
      },
      {
        id: 'factions',
        label: 'Factions',
        icon: 'flag',
        toolId: 'factions',
        isVisible: true
      },
      {
        id: 'items',
        label: 'Items',
        icon: 'sword',
        toolId: 'items',
        isVisible: true
      }
    ]
  },
  {
    id: 'ai-coach',
    label: 'AI Writing Coach',
    icon: 'brain',
    toolId: 'ai-coach',
    isVisible: true
  },
  {
    id: 'character-generator',
    label: 'Character Generator',
    icon: 'sparkles',
    toolId: 'character-generator',
    isVisible: true
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm Ideas',
    icon: 'lightbulb',
    toolId: 'brainstorm',
    isVisible: true
  }
];

// Landing Page Component
const LandingPage = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Fablecraft</span>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl animate-fade-in">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">AI-Powered Creative Writing Studio</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            <span className="gradient-text">Craft Your</span><br />
            <span className="text-slate-100">Fable</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create compelling stories with AI-powered character generation, world-building tools, and intelligent writing assistance.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Button
              onClick={() => onNavigate('projects')}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg interactive-hover h-12"
            >
              <FolderPlus className="w-5 h-5 mr-3" />
              View Projects
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('brainstorm')}
              className="group bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-slate-200 font-semibold px-8 py-4 rounded-2xl interactive-hover h-12"
            >
              <Lightbulb className="w-5 h-5 mr-3" />
              Brainstorm Ideas
            </Button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <Card className="glass-effect floating-card interactive-hover border-slate-700/50 bg-slate-800/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">New Project</h3>
                <p className="text-slate-400 text-sm">Start fresh with a novel, screenplay, or comic project.</p>
              </CardContent>
            </Card>

            <Card className="glass-effect floating-card interactive-hover border-slate-700/50 bg-slate-800/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Import Manuscript</h3>
                <p className="text-slate-400 text-sm">Upload existing work to enhance with AI tools.</p>
              </CardContent>
            </Card>

            <Card className="glass-effect floating-card interactive-hover border-slate-700/50 bg-slate-800/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Character Builder</h3>
                <p className="text-slate-400 text-sm">AI-powered character generation and development.</p>
              </CardContent>
            </Card>

            <Card className="glass-effect floating-card interactive-hover border-slate-700/50 bg-slate-800/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Map className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">World Building</h3>
                <p className="text-slate-400 text-sm">Create rich, detailed fictional worlds and lore.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Projects Dashboard Component
const ProjectsDashboard = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const projects = [
    {
      id: '1',
      name: 'The Shadow Chronicles',
      type: 'Fantasy Novel',
      lastModified: 'Last edited 2 days ago',
      wordCount: '15,427 words',
      icon: BookOpen,
      gradient: 'from-indigo-500 to-purple-600',
      tags: ['Fantasy', 'Adventure']
    },
    {
      id: '2',
      name: 'Cyber Dreams',
      type: 'Screenplay',
      lastModified: 'Last edited 1 week ago',
      wordCount: '87 pages',
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-600',
      tags: ['Sci-Fi', 'Thriller']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('landing')}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold gradient-text">Your Projects</h1>
        <Button
          onClick={() => onNavigate('workspace')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const IconComponent = project.icon;
          return (
            <Card key={project.id} className="bg-slate-800/50 border-slate-700/50 floating-card interactive-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${project.gradient} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{project.name}</CardTitle>
                      <CardDescription className="text-slate-400">{project.type}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-400">
                    <History className="w-4 h-4 mr-2" />
                    <span>{project.lastModified}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{project.wordCount}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex space-x-3">
                <Button 
                  onClick={() => onNavigate('workspace')}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                >
                  Open Project
                </Button>
                <Button variant="outline" size="icon" className="border-slate-600 hover:bg-slate-600">
                  <Link className="w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {/* New Project Card */}
        <Card className="bg-slate-800/30 border-2 border-dashed border-slate-600 interactive-hover">
          <CardContent className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Create New Project</h3>
            <p className="text-slate-400 text-sm mb-6">Start a fresh story, screenplay, or comic book project.</p>
            <Button
              onClick={() => onNavigate('workspace')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main Workspace Component
const MainWorkspace = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>(initialSidebarItems);
  const [activeTool, setActiveTool] = useState('characters');
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showBrainstormModal, setShowBrainstormModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Character form state
  const [characterForm, setCharacterForm] = useState({
    name: 'Lyra Shadowmane',
    role: 'protagonist',
    description: 'A tall, lithe figure with striking silver hair that catches the moonlight. Her emerald eyes hold ancient wisdom, while intricate tattoos wind around her arms, each telling a story of battles fought and victories won. She moves with the grace of a dancer and the precision of a seasoned warrior.',
    personality: 'Fiercely independent yet deeply loyal to those she trusts. Quick-witted with a sharp tongue, but beneath her tough exterior lies a compassionate heart. She struggles with trust issues stemming from past betrayals.',
    motivations: 'Seeks to uncover the truth about her family\'s mysterious disappearance. Driven by a need to protect the innocent while battling her own inner demons. Her ultimate goal is to find peace and belonging in a world that has shown her little kindness.',
    backstory: 'Born into nobility, Lyra\'s world crumbled when her family was accused of treason. Forced to flee at age sixteen, she learned to survive on the streets, eventually becoming a skilled assassin. Years later, she discovered evidence suggesting her family was framed, setting her on a path of vengeance and truth-seeking that would define her adult life.',
    fears: 'Deep fear of abandonment and betrayal. Terrified of becoming like those who destroyed her family. Afraid that her quest for vengeance will consume what humanity she has left.',
    secrets: 'Possesses latent magical abilities she\'s afraid to use. Secretly funded by an underground resistance movement. Has a half-brother she believes is dead but who actually serves her enemies.'
  });

  const renderSidebarItem = (item: SidebarItem, index: number, parentPath = '') => {
    const Icon = iconMap[item.icon] || FileText;
    const path = parentPath ? `${parentPath}-${index}` : index.toString();
    const isActive = activeTool === item.toolId;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`w-full justify-start ${isActive ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          onClick={() => setActiveTool(item.toolId)}
        >
          <Icon className="w-5 h-5 mr-3" />
          <span className="flex-grow text-left">{item.label}</span>
          {item.toolId === 'characters' && <Badge variant="secondary" className="ml-auto bg-slate-600 text-slate-300">7</Badge>}
          {item.toolId === 'locations' && <Badge variant="secondary" className="ml-auto bg-slate-600 text-slate-300">12</Badge>}
          {item.toolId === 'factions' && <Badge variant="secondary" className="ml-auto bg-slate-600 text-slate-300">3</Badge>}
          {item.toolId === 'items' && <Badge variant="secondary" className="ml-auto bg-slate-600 text-slate-300">5</Badge>}
        </Button>
        {hasChildren && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children!.map((child, childIndex) => renderSidebarItem(child, childIndex, path))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTool) {
      case 'characters':
        return (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Character Profile Card */}
              <Card className="bg-slate-800/50 border-slate-700/50 floating-card">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6 mb-8">
                    {/* Character Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl border border-slate-600/50 flex items-center justify-center group cursor-pointer hover:border-indigo-500/50 transition-colors">
                        <User className="w-12 h-12 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 border-slate-600 hover:bg-slate-600"
                      >
                        Generate Image
                      </Button>
                    </div>

                    {/* Character Details */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-400 font-semibold">Character Name</Label>
                          <Input
                            value={characterForm.name}
                            onChange={(e) => setCharacterForm({...characterForm, name: e.target.value})}
                            className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-400 font-semibold">Role</Label>
                          <Select value={characterForm.role} onValueChange={(value) => setCharacterForm({...characterForm, role: value})}>
                            <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="protagonist">Protagonist</SelectItem>
                              <SelectItem value="antagonist">Antagonist</SelectItem>
                              <SelectItem value="supporting">Supporting Character</SelectItem>
                              <SelectItem value="minor">Minor Character</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Character Archetypes */}
                      <div>
                        <Label className="text-slate-400 font-semibold">Archetypes</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            The Reluctant Hero
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            The Survivor
                          </Badge>
                          <Button variant="outline" size="sm" className="border-dashed border-slate-600 hover:border-slate-500 text-slate-400">
                            + Add Archetype
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Character Description */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-slate-400 font-semibold">Physical Description</Label>
                      <Textarea
                        value={characterForm.description}
                        onChange={(e) => setCharacterForm({...characterForm, description: e.target.value})}
                        className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-slate-400 font-semibold">Personality Traits</Label>
                        <Textarea
                          value={characterForm.personality}
                          onChange={(e) => setCharacterForm({...characterForm, personality: e.target.value})}
                          className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label className="text-slate-400 font-semibold">Core Motivations</Label>
                        <Textarea
                          value={characterForm.motivations}
                          onChange={(e) => setCharacterForm({...characterForm, motivations: e.target.value})}
                          className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Character Development Tabs */}
              <Card className="bg-slate-800/50 border-slate-700/50 floating-card">
                <Tabs defaultValue="backstory" className="w-full">
                  <div className="border-b border-slate-700/50 p-6 pb-0">
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="backstory" className="data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-300">
                        Backstory
                      </TabsTrigger>
                      <TabsTrigger value="flaws" className="data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-300">
                        Strengths & Flaws
                      </TabsTrigger>
                      <TabsTrigger value="relationships" className="data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-300">
                        Relationships
                      </TabsTrigger>
                      <TabsTrigger value="arc" className="data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-300">
                        Story Arc
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="backstory" className="p-6">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-slate-400 font-semibold">Character Backstory</Label>
                        <Textarea
                          value={characterForm.backstory}
                          onChange={(e) => setCharacterForm({...characterForm, backstory: e.target.value})}
                          className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                          rows={6}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-slate-400 font-semibold">Greatest Fears</Label>
                          <Textarea
                            value={characterForm.fears}
                            onChange={(e) => setCharacterForm({...characterForm, fears: e.target.value})}
                            className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-slate-400 font-semibold">Hidden Secrets</Label>
                          <Textarea
                            value={characterForm.secrets}
                            onChange={(e) => setCharacterForm({...characterForm, secrets: e.target.value})}
                            className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="flaws" className="p-6">
                    <div className="text-center text-slate-400">
                      Character strengths and flaws development tools coming soon...
                    </div>
                  </TabsContent>

                  <TabsContent value="relationships" className="p-6">
                    <div className="text-center text-slate-400">
                      Character relationships mapping tools coming soon...
                    </div>
                  </TabsContent>

                  <TabsContent value="arc" className="p-6">
                    <div className="text-center text-slate-400">
                      Character story arc development tools coming soon...
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* AI Enhancement Panel */}
              <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white">AI Character Enhancement</h3>
                        <p className="text-slate-400 text-sm">Let AI help develop your character further</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowCharacterModal(true)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                    >
                      <BrainCircuit className="w-4 h-4 mr-2" />
                      Enhance Character
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="bg-slate-800/50 border-slate-600/50 h-auto p-4 flex flex-col items-start">
                      <Users className="w-6 h-6 text-indigo-400 mb-2" />
                      <h4 className="font-medium mb-1 text-white">Generate Traits</h4>
                      <p className="text-slate-400 text-sm">Add personality traits and quirks</p>
                    </Button>
                    <Button variant="outline" className="bg-slate-800/50 border-slate-600/50 h-auto p-4 flex flex-col items-start">
                      <ImageIcon className="w-6 h-6 text-purple-400 mb-2" />
                      <h4 className="font-medium mb-1 text-white">Create Portrait</h4>
                      <p className="text-slate-400 text-sm">Generate character artwork</p>
                    </Button>
                    <Button variant="outline" className="bg-slate-800/50 border-slate-600/50 h-auto p-4 flex flex-col items-start">
                      <Link className="w-6 h-6 text-emerald-400 mb-2" />
                      <h4 className="font-medium mb-1 text-white">Build Relations</h4>
                      <p className="text-slate-400 text-sm">Create character connections</p>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Tool Under Development</h3>
              <p className="text-slate-400">This feature is being built and will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-850/80 border-r border-slate-700/50 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg gradient-text">Mythos Weaver</h2>
                <p className="text-slate-400 text-sm">{project.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('projects')}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* Project Section */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Project</h3>
              <div className="space-y-1">
                {sidebarItems.slice(0, 2).map((item, index) => renderSidebarItem(item, index))}
              </div>
            </div>

            {/* World Bible Section */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">World Bible</h3>
              <div className="space-y-1">
                {sidebarItems.slice(2, 3).map((item, index) => renderSidebarItem(item, index + 2))}
              </div>
            </div>

            {/* AI Tools Section */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">AI Tools</h3>
              <div className="space-y-1">
                {sidebarItems.slice(3).map((item, index) => renderSidebarItem(item, index + 3))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-slate-850/50 border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Character Builder</h1>
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI-Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-600">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={() => setShowCharacterModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        {renderContent()}
      </main>

      {/* Character Generation Modal */}
      <Dialog open={showCharacterModal} onOpenChange={setShowCharacterModal}>
        <DialogContent className="glass-effect border-slate-700 max-w-2xl" aria-describedby="character-gen-description">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="gradient-text">AI Character Generator</DialogTitle>
            </div>
            <DialogDescription id="character-gen-description">
              Create detailed characters using AI assistance. Provide a character concept and story role to generate comprehensive character profiles.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label className="text-slate-400 font-semibold">Character Concept</Label>
              <Textarea
                placeholder="Describe your character idea... e.g., 'A grizzled dwarven warrior who lost his clan to a dragon attack'"
                className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 font-semibold">Story Role</Label>
                <Select>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="protagonist">Protagonist</SelectItem>
                    <SelectItem value="antagonist">Antagonist</SelectItem>
                    <SelectItem value="supporting">Supporting Character</SelectItem>
                    <SelectItem value="minor">Minor Character</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400 font-semibold">Genre Focus</Label>
                <Select>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="scifi">Science Fiction</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card className="bg-indigo-500/10 border border-indigo-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">AI Enhancement Options</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="portrait" defaultChecked />
                    <Label htmlFor="portrait" className="text-slate-300 text-sm">Generate character portrait</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="backstory" defaultChecked />
                    <Label htmlFor="backstory" className="text-slate-300 text-sm">Create detailed backstory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="relationships" />
                    <Label htmlFor="relationships" className="text-slate-300 text-sm">Generate character relationships</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowCharacterModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? 'Generating...' : 'Generate Character'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Brainstorm Modal */}
      <Dialog open={showBrainstormModal} onOpenChange={setShowBrainstormModal}>
        <DialogContent className="glass-effect border-slate-700 max-w-3xl max-h-[90vh]" aria-describedby="brainstorm-description">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="gradient-text">AI Story Brainstorming</DialogTitle>
            </div>
            <DialogDescription id="brainstorm-description">
              Generate story ideas, plot twists, character arcs, and narrative elements using AI assistance to enhance your creative writing process.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              <div>
                <Label className="text-slate-400 font-semibold">Story Concept</Label>
                <Input
                  placeholder="e.g., A detective story in a city that never sleeps..."
                  className="bg-slate-700/50 border-slate-600/50 text-slate-200 mt-2"
                />
              </div>
              
              {/* AI Generated Results */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg text-amber-400 mb-3 flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Title Suggestion
                    </h3>
                    <p className="text-slate-200 text-lg font-medium">"Neon Shadows: A Midnight Detective Story"</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-amber-400 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Logline
                    </h3>
                    <p className="text-slate-300 leading-relaxed">A cynical detective in a perpetually awake metropolis must solve a series of murders that only occur during the city's rare moments of darkness, uncovering a conspiracy that threatens the artificial light keeping the city alive.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-amber-400 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Character Archetypes
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-slate-300">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        <span>The Insomniac Detective - A sleep-deprived investigator who sees patterns others miss</span>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>The Shadow Killer - A mysterious figure who strikes only in darkness</span>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-300">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>The Light Keeper - Guardian of the city's eternal illumination system</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-center space-x-4">
                <Button className="bg-amber-600 hover:bg-amber-500">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate New Ideas
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main Workspace Component
export default function Workspace() {
  const [currentView, setCurrentView] = useState('landing');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentView === 'projects' && <ProjectsDashboard onNavigate={handleNavigate} />}
      {currentView === 'workspace' && <MainWorkspace onNavigate={handleNavigate} />}
    </div>
  );
}
