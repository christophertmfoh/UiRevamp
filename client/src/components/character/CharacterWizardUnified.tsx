import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  X, ArrowLeft, Sparkles, FileText, Upload, Pencil, 
  Check, Save, Clock, Crown
} from 'lucide-react';
import { CharacterGuidedCreationUnified } from './CharacterGuidedCreationUnified';
import { CharacterTemplatesUnified } from './CharacterTemplatesUnified';
import { CharacterAICreationUnified } from './CharacterAICreationUnified';
import { CharacterDocumentUploadUnified } from './CharacterDocumentUploadUnified';
import type { Character } from '@/lib/types';

interface CharacterWizardUnifiedProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onComplete?: (character: Character) => void;
}

type CreationMethod = 'selection' | 'guided' | 'templates' | 'ai' | 'upload';

interface CreationMethodOption {
  id: CreationMethod;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  timeEstimate: string;
  complexity: string;
}

const CREATION_METHODS: CreationMethodOption[] = [
  {
    id: 'guided',
    title: 'Build Your Own',
    subtitle: 'Step-by-step character creation',
    description: 'Create a detailed character through our comprehensive guided process with 160+ fields organized into intuitive sections.',
    icon: Pencil,
    features: ['160+ Character Fields', '11 Organized Sections', 'Progress Tracking', 'Auto-Save'],
    timeEstimate: '10-20 min',
    complexity: 'Comprehensive'
  },
  // TEMPORARILY DISABLED: AI Templates (module preserved for future rebuild)
  // {
  //   id: 'templates',
  //   title: 'AI Templates', 
  //   subtitle: 'Choose from 30+ archetypes',
  //   description: 'Select from our curated collection of 30+ professional character templates and let AI expand them into complete profiles.',
  //   icon: Sparkles,
  //   features: ['30+ Templates', 'Multiple Genres', 'AI Enhancement', 'Instant Creation'],
  //   timeEstimate: '1-2 min',
  //   complexity: 'Quick & Easy'
  // },
  // TEMPORARILY DISABLED: Custom AI (module preserved for future rebuild)
  // {
  //   id: 'ai',
  //   title: 'Custom AI',
  //   subtitle: 'Describe your vision',
  //   description: 'Tell our AI about your character concept and watch it create a detailed, unique character profile tailored to your story.',
  //   icon: Crown,
  //   features: ['Custom Descriptions', 'Writing Tips', 'Example Prompts', 'AI Enhancement'],
  //   timeEstimate: '2-3 min', 
  //   complexity: 'Creative Freedom'
  // },
  {
    id: 'upload',
    title: 'Upload Document',
    subtitle: 'Import existing characters',
    description: 'Upload documents containing character information and let AI extract and organize the details into a structured profile.',
    icon: Upload,
    features: ['Multiple Formats', 'Smart Extraction', 'Auto-Organization', 'Quick Import'],
    timeEstimate: '3-5 min',
    complexity: 'Import & Organize'
  }
];

export default function CharacterWizardUnified({
  isOpen,
  onClose,
  projectId,
  onComplete
}: CharacterWizardUnifiedProps) {
  const [currentMethod, setCurrentMethod] = useState<CreationMethod>('selection');
  const [draftData, setDraftData] = useState<any>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  // Load draft from localStorage
  useEffect(() => {
    if (isOpen && projectId) {
      const savedDraft = localStorage.getItem(`character-draft-${projectId}`);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          // Validate draft structure
          if (draft && draft.method && draft.data && draft.lastSaved) {
            // Ensure lastSaved is a valid date
            if (typeof draft.lastSaved === 'string' || typeof draft.lastSaved === 'number') {
              draft.lastSaved = new Date(draft.lastSaved);
            }
            if (draft.lastSaved instanceof Date && !isNaN(draft.lastSaved.getTime())) {
              setDraftData(draft);
            } else {
              // Clear invalid draft
              localStorage.removeItem(`character-draft-${projectId}`);
            }
          }
        } catch (error) {
          console.error('Failed to load draft:', error);
          localStorage.removeItem(`character-draft-${projectId}`);
        }
      }
    }
  }, [isOpen, projectId]);

  // Auto-save functionality
  const autoSave = (method: string, data: Record<string, any>, progress: number) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setIsAutoSaving(true);
    autoSaveTimerRef.current = setTimeout(() => {
      const draftToSave = {
        method,
        data,
        progress,
        lastSaved: new Date().toISOString(),
        projectId
      };
      
      localStorage.setItem(`character-draft-${projectId}`, JSON.stringify(draftToSave));
      setIsAutoSaving(false);
    }, 1000);
  };

  const clearDraft = () => {
    localStorage.removeItem(`character-draft-${projectId}`);
    setDraftData(null);
  };

  const handleMethodSelect = (method: CreationMethod) => {
    setCurrentMethod(method);
  };

  const handleBack = () => {
    if (currentMethod !== 'selection') {
      setCurrentMethod('selection');
    }
  };

  const handleComplete = (character: Character) => {
    clearDraft();
    onComplete?.(character);
    onClose();
  };

  const renderMethodCard = (method: CreationMethodOption) => (
    <div
      key={method.id}
      onClick={() => handleMethodSelect(method.id)}
      className={cn(
        "group relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer",
        "hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <method.icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-xl text-foreground">{method.title}</h3>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {method.timeEstimate}
              </div>
              <div className="mt-1 px-2 py-1 rounded-md bg-muted text-xs font-medium">
                {method.complexity}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {method.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm font-medium text-foreground">Choose this method</span>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentMethod) {
      case 'selection':
        return (
          <div className="h-full flex flex-col">
            {/* Header Section - Fixed */}
            <div className="flex-shrink-0 text-center py-6 px-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground mb-2">Create New Character</h2>
              <p className="text-muted-foreground">Choose how you'd like to create your character</p>
            </div>

            {/* Draft Recovery - Fixed */}
            {draftData && (
              <div className="flex-shrink-0 mx-6 mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Save className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-primary">Continue Previous Work</h4>
                    <p className="text-sm text-primary/80 mt-1">
                      You have unsaved progress from {
                        draftData.lastSaved instanceof Date 
                          ? draftData.lastSaved.toLocaleDateString()
                          : new Date(draftData.lastSaved).toLocaleDateString()
                      }
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleMethodSelect(draftData.method)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Continue ({Math.round(draftData.progress || 0)}% complete)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearDraft}
                        className="border-primary/20 text-primary hover:bg-primary/5"
                      >
                        Start Fresh
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Method Cards - Scrollable if needed */}
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              <div className="max-w-4xl mx-auto grid gap-4">
                {CREATION_METHODS.map(renderMethodCard)}
              </div>
            </div>
          </div>
        );

      case 'guided':
        return (
          <CharacterGuidedCreationUnified
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
            onAutoSave={autoSave}
          />
        );

      // TEMPORARILY DISABLED: AI Templates (module preserved for future rebuild)
      // case 'templates':
      //   return (
      //     <CharacterTemplatesUnified
      //       projectId={projectId}
      //       onBack={handleBack}
      //       onComplete={handleComplete}
      //     />
      //   );

      // TEMPORARILY DISABLED: Custom AI (module preserved for future rebuild)
      // case 'ai':
      //   return (
      //     <CharacterAICreationUnified
      //       projectId={projectId}
      //       onBack={handleBack}
      //       onComplete={handleComplete}
      //     />
      //   );

      case 'upload':
        return (
          <CharacterDocumentUploadUnified
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        );

      default:
        return null;
    }
  };

  const currentMethodInfo = CREATION_METHODS.find(m => m.id === currentMethod);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden bg-background"
        hideCloseButton
      >
        {/* UNIFIED HEADER - SINGLE EXIT POINT */}
        <div 
          className={cn(
            "flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border",
            currentMethod !== 'selection' && "bg-primary/5"
          )}
        >
          <div className="flex items-center gap-4">
            {currentMethod !== 'selection' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="gap-2 hover:bg-background/50 text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="h-6 w-px bg-border" />
              </>
            )}
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {currentMethod === 'selection' 
                  ? 'Character Creator' 
                  : currentMethodInfo?.title || 'Character Creator'
                }
              </h1>
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Save className="h-3 w-3 animate-pulse" />
                  Auto-saving...
                </div>
              )}
            </div>
          </div>
          
          {/* SINGLE EXIT BUTTON - ALWAYS VISIBLE */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted flex-shrink-0"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* MAIN CONTENT - NO SCROLLING AT WIZARD LEVEL */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}