import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Sparkles, FileText, Upload, Pencil, ArrowLeft, X, Clock, 
  Crown, Wand2, BookOpen, Check, Save, AlertCircle
} from 'lucide-react';
import { CharacterGuidedCreation } from './CharacterGuidedCreation';
import { CharacterTemplates } from './CharacterTemplates';
import { CharacterGenerationModal } from './CharacterGenerationModal';
import { CharacterDocumentUpload } from './CharacterDocumentUpload';
import type { Character } from '@/lib/types';

interface CharacterCreationWizardV4Props {
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
  complexity: 'Quick' | 'Moderate' | 'Detailed';
  timeEstimate: string;
  recommended?: boolean;
  color: {
    primary: string;
    secondary: string;
    bg: string;
    border: string;
    hover: string;
  };
}

const CREATION_METHODS: CreationMethodOption[] = [
  {
    id: 'guided',
    title: 'Build Your Own',
    subtitle: 'Complete Control',
    description: 'Create a character from scratch with our comprehensive guided builder',
    icon: Pencil,
    features: ['160+ detailed fields', 'Step-by-step guidance', 'Auto-save progress', 'Full customization'],
    complexity: 'Detailed',
    timeEstimate: '15-20 min',
    color: {
      primary: 'text-blue-600',
      secondary: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hover: 'hover:border-blue-400'
    }
  },
  {
    id: 'templates',
    title: 'AI-Enhanced Templates',
    subtitle: 'Recommended',
    description: 'Choose from professional templates and let AI expand them into complete characters',
    icon: FileText,
    features: ['20+ curated templates', 'AI enhancement', 'Auto portrait generation', 'Quick setup'],
    complexity: 'Moderate',
    timeEstimate: '5-10 min',
    recommended: true,
    color: {
      primary: 'text-emerald-600',
      secondary: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      hover: 'hover:border-emerald-400'
    }
  },
  {
    id: 'ai',
    title: 'Custom AI Generation',
    subtitle: 'Describe Your Vision',
    description: 'Describe your character idea and let AI create a complete character profile',
    icon: Sparkles,
    features: ['Natural language input', 'Complete generation', 'AI portrait creation', 'Instant results'],
    complexity: 'Quick',
    timeEstimate: '2-5 min',
    color: {
      primary: 'text-purple-600',
      secondary: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      hover: 'hover:border-purple-400'
    }
  },
  {
    id: 'upload',
    title: 'Import Document',
    subtitle: 'Use Existing Work',
    description: 'Upload character documents and let AI extract and organize the information',
    icon: Upload,
    features: ['Multiple formats', 'Smart parsing', 'Data extraction', 'Preserves details'],
    complexity: 'Quick',
    timeEstimate: '3-7 min',
    color: {
      primary: 'text-orange-600',
      secondary: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hover: 'hover:border-orange-400'
    }
  }
];

interface DraftData {
  method: CreationMethod;
  data: Record<string, any>;
  progress: number;
  lastSaved: Date;
}

export default function CharacterCreationWizardV4({
  isOpen,
  onClose,
  projectId,
  onComplete
}: CharacterCreationWizardV4Props) {
  const [currentMethod, setCurrentMethod] = useState<CreationMethod>('selection');
  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load draft from localStorage
  useEffect(() => {
    if (isOpen && projectId) {
      const savedDraft = localStorage.getItem(`character-draft-${projectId}`);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setDraftData(draft);
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [isOpen, projectId]);

  // Auto-save functionality
  const autoSave = (method: CreationMethod, data: Record<string, any>, progress: number) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setIsAutoSaving(true);
    autoSaveTimeoutRef.current = setTimeout(() => {
      const draft: DraftData = {
        method,
        data,
        progress,
        lastSaved: new Date()
      };
      
      localStorage.setItem(`character-draft-${projectId}`, JSON.stringify(draft));
      setDraftData(draft);
      setIsAutoSaving(false);
    }, 1000);
  };

  const clearDraft = () => {
    localStorage.removeItem(`character-draft-${projectId}`);
    setDraftData(null);
  };

  const handleBack = () => {
    setCurrentMethod('selection');
  };

  const handleComplete = (character: Character) => {
    clearDraft();
    onComplete?.(character);
    onClose();
  };

  const handleMethodSelect = (methodId: CreationMethod) => {
    setCurrentMethod(methodId);
  };

  const handleClose = () => {
    onClose();
  };

  const renderMethodCard = (method: CreationMethodOption) => (
    <Card
      key={method.id}
      className={cn(
        "relative cursor-pointer transition-all duration-200 border-2",
        method.color.border,
        method.color.hover,
        "hover:shadow-lg hover:-translate-y-1"
      )}
      onClick={() => handleMethodSelect(method.id)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-3 rounded-lg", method.color.bg)}>
              <method.icon className={cn("h-6 w-6", method.color.primary)} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{method.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("text-sm", method.color.secondary)}>
                  {method.subtitle}
                </span>
                {method.recommended && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                    <Crown className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {method.timeEstimate}
            </div>
            <Badge variant="outline" className="mt-1">
              {method.complexity}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">
          {method.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {method.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-sm font-medium">Choose this method</span>
          <div className={cn("p-2 rounded-lg", method.color.bg)}>
            <ArrowLeft className={cn("h-4 w-4 rotate-180", method.color.primary)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (currentMethod) {
      case 'selection':
        return (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Create New Character</h2>
              <p className="text-muted-foreground">
                Choose how you'd like to create your character
              </p>
            </div>

            {/* Draft Recovery */}
            {draftData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Save className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">Continue Previous Work</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You have unsaved progress from {draftData.lastSaved.toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleMethodSelect(draftData.method)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Continue ({Math.round(draftData.progress)}% complete)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearDraft}
                      >
                        Start Fresh
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Method Cards */}
            <div className="grid gap-4">
              {CREATION_METHODS.map(renderMethodCard)}
            </div>

            {/* Tips */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Tips for Best Results</h4>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• New to character creation? Start with <strong>AI-Enhanced Templates</strong></li>
                    <li>• Want complete control? Use <strong>Build Your Own</strong></li>
                    <li>• Have existing work? Try <strong>Import Document</strong></li>
                    <li>• Quick idea? Use <strong>Custom AI Generation</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'guided':
        return (
          <CharacterGuidedCreation
            isOpen={true}
            onClose={handleClose}
            projectId={projectId}
            onBack={handleBack}
          />
        );

      case 'templates':
        return (
          <CharacterTemplates
            isOpen={true}
            onClose={handleClose}
            projectId={projectId}
            onBack={handleBack}
            onSelectTemplate={(character) => handleComplete(character)}
          />
        );

      case 'ai':
        return (
          <CharacterGenerationModal
            isOpen={true}
            onClose={handleClose}
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        );

      case 'upload':
        return (
          <CharacterDocumentUpload
            isOpen={true}
            onClose={handleClose}
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentMethod !== 'selection' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <div className="h-6 w-px bg-border" />
                </>
              )}
              <div>
                <DialogTitle>
                  {currentMethod === 'selection' 
                    ? 'Character Creator' 
                    : CREATION_METHODS.find(m => m.id === currentMethod)?.title || 'Character Creator'
                  }
                </DialogTitle>
                {isAutoSaving && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Save className="h-3 w-3 animate-pulse" />
                    Auto-saving...
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}