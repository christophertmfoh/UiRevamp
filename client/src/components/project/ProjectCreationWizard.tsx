import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, 
  BookOpen, 
  Upload, 
  ArrowLeft, 
  ArrowRight,
  FileText,
  Wand2,
  PenTool,
  Globe,
  Swords,
  Heart,
  Skull,
  Rocket,
  Crown,
  Feather,
  Scroll
} from 'lucide-react';

interface ProjectCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectData: any) => void;
}

type WizardMode = 'selection' | 'manual' | 'ai' | 'upload';
type ProjectType = 'novel' | 'screenplay' | 'comic' | 'dnd-campaign' | 'poetry';

const genres = [
  'Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Thriller', 
  'Horror', 'Historical', 'Literary', 'Adventure', 'Crime',
  'Western', 'Dystopian', 'Urban Fantasy', 'Epic Fantasy',
  'Space Opera', 'Cyberpunk', 'Steampunk', 'Paranormal',
  'Contemporary', 'Magical Realism', 'Smut', 'Erotica',
  'Dark Romance', 'Cozy Mystery', 'Psychological Thriller',
  'Military Sci-Fi', 'LitRPG', 'Reverse Harem', 'Romantasy',
  'Dark Fantasy', 'Grimdark', 'New Adult', 'Young Adult',
  'Middle Grade', 'Slice of Life', 'Satire', 'Mythology',
  'Fairy Tale Retelling', 'Time Travel', 'Alternate History',
  'Post-Apocalyptic', 'Superhero', 'Sword & Sorcery'
];

const projectTypes = [
  { id: 'novel', label: 'Novel', icon: BookOpen, description: 'Traditional narrative storytelling' },
  { id: 'screenplay', label: 'Screenplay', icon: FileText, description: 'Scripts for film and television' },
  { id: 'comic', label: 'Comic/Graphic Novel', icon: PenTool, description: 'Visual storytelling with panels' },
  { id: 'dnd-campaign', label: 'D&D Campaign', icon: Swords, description: 'Tabletop RPG adventures' },
  { id: 'poetry', label: 'Poetry', icon: Feather, description: 'Collections of poems' }
];

export function ProjectCreationWizard({ isOpen, onClose, onCreate }: ProjectCreationWizardProps) {
  const [mode, setMode] = useState<WizardMode>('selection');
  const [step, setStep] = useState(0);
  
  // Manual creation state
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('novel');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [synopsis, setSynopsis] = useState('');
  
  // AI creation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenre, setAiGenre] = useState('');
  const [aiTone, setAiTone] = useState('');
  
  // Upload state
  const [uploadType, setUploadType] = useState<'world-bible' | 'manuscript' | 'character' | 'location'>('manuscript');

  const resetWizard = () => {
    setMode('selection');
    setStep(0);
    setProjectName('');
    setProjectType('novel');
    setSelectedGenres([]);
    setDescription('');
    setSynopsis('');
    setAiPrompt('');
    setAiGenre('');
    setAiTone('');
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const renderSelectionScreen = () => (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-foreground">How would you like to start?</h2>
        <p className="text-muted-foreground">Choose your preferred way to begin your creative journey</p>
      </div>

      <div className="grid gap-4">
        <Card 
          className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-white/60 dark:bg-slate-700/40 backdrop-blur-xl border-stone-300/30 dark:border-slate-700/20 hover:shadow-2xl"
          onClick={() => setMode('manual')}
        >
          <div className="p-6 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-xl gradient-primary-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <PenTool className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">Create Your Own Project</h3>
              <p className="text-sm text-muted-foreground">Start from scratch with full creative control. Perfect for writers who know their vision.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </Card>

        <Card 
          className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-white/60 dark:bg-slate-700/40 backdrop-blur-xl border-stone-300/30 dark:border-slate-700/20 hover:shadow-2xl"
          onClick={() => setMode('ai')}
        >
          <div className="p-6 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-xl gradient-primary-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">Get Started with AI</h3>
              <p className="text-sm text-muted-foreground">Let AI help you develop your story idea. Great for overcoming writer's block.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </Card>

        <Card 
          className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-white/60 dark:bg-slate-700/40 backdrop-blur-xl border-stone-300/30 dark:border-slate-700/20 hover:shadow-2xl"
          onClick={() => setMode('upload')}
        >
          <div className="p-6 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-xl gradient-primary-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">Upload Document</h3>
              <p className="text-sm text-muted-foreground">Import existing world bibles, manuscripts, or character sheets to continue your work.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </Card>
      </div>
    </div>
  );

  const renderManualCreation = () => {
    const steps = [
      'Project Details',
      'Project Type',
      'Genre Selection',
      'Story Synopsis'
    ];

    return (
      <div className="p-6">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((stepName, index) => (
              <div 
                key={index}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  index <= step 
                    ? 'gradient-primary-br text-white' 
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    index < step 
                      ? 'gradient-primary' 
                      : 'bg-stone-200 dark:bg-stone-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
        </div>

        {/* Step content */}
        <div className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name" className="text-base font-bold mb-2 text-foreground">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter your project name..."
                  className="mt-2 bg-white/80 dark:bg-slate-800/60"
                />
                <p className="text-xs text-muted-foreground mt-1">Choose a memorable name for your creative work</p>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-base font-bold mb-2 text-foreground">Brief Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short description of your project..."
                  className="mt-2 min-h-[100px] bg-white/80 dark:bg-slate-800/60"
                />
                <p className="text-xs text-muted-foreground mt-1">This helps you remember the core concept</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">What are you creating?</h3>
              <div className="grid gap-3">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all duration-300 bg-white/60 dark:bg-slate-700/40 border-stone-300/30 dark:border-slate-700/20 ${
                        projectType === type.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:scale-[1.01] hover:shadow-lg'
                      }`}
                      onClick={() => setProjectType(type.id as ProjectType)}
                    >
                      <div className="p-4 flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          projectType === type.id
                            ? 'gradient-primary-br'
                            : 'bg-stone-200 dark:bg-stone-700'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            projectType === type.id ? 'text-white' : 'text-stone-600 dark:text-stone-300'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{type.label}</h4>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Select your genres</h3>
              <p className="text-sm text-muted-foreground">Choose one or more genres that best fit your story</p>
              <div className="max-h-[300px] overflow-y-auto pr-2 border rounded-lg p-4 bg-white/60 dark:bg-slate-700/40 border-stone-200 dark:border-slate-700/30">
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedGenres.includes(genre)
                          ? 'gradient-primary text-white border-transparent'
                          : 'hover:scale-105 border-stone-300 dark:border-stone-600 text-foreground'
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              {selectedGenres.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="synopsis" className="text-base font-bold mb-2 text-foreground">Story Synopsis (Optional)</Label>
                <Textarea
                  id="synopsis"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Tell us about your story idea..."
                  className="mt-2 min-h-[150px] bg-white/80 dark:bg-slate-800/60"
                />
                <p className="text-xs text-muted-foreground mt-1">This helps our AI understand your vision and provide better assistance</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => step > 0 ? setStep(step - 1) : setMode('selection')}
            className="flex items-center border-stone-300 dark:border-stone-600 text-foreground hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 0 ? 'Back' : 'Previous'}
          </Button>
          
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !projectName.trim()}
              className="gradient-primary hover:opacity-90 text-white flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                onCreate({
                  name: projectName,
                  type: projectType,
                  genres: selectedGenres,
                  description,
                  synopsis
                });
                handleClose();
              }}
              disabled={!projectName.trim()}
              className="gradient-primary hover:opacity-90 text-white flex items-center"
            >
              Create Project
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderAICreation = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary-br flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-foreground">AI Story Assistant</h2>
          <p className="text-muted-foreground">This feature will help you develop your story idea with AI guidance</p>
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start space-x-3">
            <Wand2 className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Coming Soon!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI story development wizard is currently being crafted. Soon you'll be able to:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Brainstorm story ideas with AI</li>
                <li>• Generate character concepts</li>
                <li>• Develop plot outlines</li>
                <li>• Create world-building elements</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setMode('selection')}
            className="flex items-center border-stone-300 dark:border-stone-600 text-foreground hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  };

  const renderUploadScreen = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary-br flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Document Upload</h2>
          <p className="text-muted-foreground">Import your existing creative work</p>
        </div>

        <Card className="p-6 bg-muted/30 border-muted-foreground/20">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Feature In Development</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Document upload functionality is being developed. Soon you'll be able to import:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• World bibles and story notes</li>
                <li>• Existing manuscripts</li>
                <li>• Character sheets and profiles</li>
                <li>• Location descriptions</li>
                <li>• Plot outlines and story structures</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setMode('selection')}
            className="flex items-center border-stone-300 dark:border-stone-600 text-foreground hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[2rem] border border-stone-300/30 dark:border-slate-700/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-primary-text">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        {mode === 'selection' && renderSelectionScreen()}
        {mode === 'manual' && renderManualCreation()}
        {mode === 'ai' && renderAICreation()}
        {mode === 'upload' && renderUploadScreen()}
      </DialogContent>
    </Dialog>
  );
}