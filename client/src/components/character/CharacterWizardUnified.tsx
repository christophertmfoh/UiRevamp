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

// Unified color theme system - STRICT ADHERENCE REQUIRED
const WIZARD_THEME = {
  guided: {
    primary: '#3B82F6',      // blue-500
    primaryHover: '#2563EB', // blue-600
    secondary: '#93C5FD',    // blue-300
    background: '#EFF6FF',   // blue-50
    border: '#DBEAFE',       // blue-100
  },
  templates: {
    primary: '#10B981',      // emerald-500
    primaryHover: '#059669', // emerald-600
    secondary: '#6EE7B7',    // emerald-300
    background: '#ECFDF5',   // emerald-50
    border: '#D1FAE5',       // emerald-100
  },
  ai: {
    primary: '#8B5CF6',      // violet-500
    primaryHover: '#7C3AED', // violet-600
    secondary: '#C4B5FD',    // violet-300
    background: '#F5F3FF',   // violet-50
    border: '#E0E7FF',       // violet-100
  },
  upload: {
    primary: '#F59E0B',      // amber-500
    primaryHover: '#D97706', // amber-600
    secondary: '#FCD34D',    // amber-300
    background: '#FFFBEB',   // amber-50
    border: '#FEF3C7',       // amber-100
  }
} as const;

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
  theme: typeof WIZARD_THEME.guided;
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
    theme: WIZARD_THEME.guided
  },
  {
    id: 'templates',
    title: 'AI-Enhanced Templates',
    subtitle: 'Recommended',
    description: 'Choose from professional templates and let AI expand them',
    icon: FileText,
    features: ['20+ curated templates', 'AI enhancement', 'Auto portrait generation', 'Quick setup'],
    complexity: 'Moderate',
    timeEstimate: '5-10 min',
    recommended: true,
    theme: WIZARD_THEME.templates
  },
  {
    id: 'ai',
    title: 'Custom AI Generation',
    subtitle: 'Describe Your Vision',
    description: 'Describe your character idea and let AI create a complete profile',
    icon: Sparkles,
    features: ['Natural language input', 'Complete generation', 'AI portrait creation', 'Instant results'],
    complexity: 'Quick',
    timeEstimate: '2-5 min',
    theme: WIZARD_THEME.ai
  },
  {
    id: 'upload',
    title: 'Import Document',
    subtitle: 'Use Existing Work',
    description: 'Upload character documents and let AI extract information',
    icon: Upload,
    features: ['Multiple formats', 'Smart parsing', 'Data extraction', 'Preserves details'],
    complexity: 'Quick',
    timeEstimate: '3-7 min',
    theme: WIZARD_THEME.upload
  }
];

interface DraftData {
  method: CreationMethod;
  data: Record<string, any>;
  progress: number;
  lastSaved: Date;
}

export default function CharacterWizardUnified({
  isOpen,
  onClose,
  projectId,
  onComplete
}: CharacterWizardUnifiedProps) {
  const [currentMethod, setCurrentMethod] = useState<CreationMethod>('selection');
  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Get current theme based on method
  const getCurrentTheme = () => {
    const method = CREATION_METHODS.find(m => m.id === currentMethod);
    return method?.theme || WIZARD_THEME.guided;
  };

  // Load draft from localStorage with robust error handling
  useEffect(() => {
    if (isOpen && projectId) {
      const savedDraft = localStorage.getItem(`character-draft-${projectId}`);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft && draft.method && draft.data && draft.lastSaved) {
            if (typeof draft.lastSaved === 'string' || typeof draft.lastSaved === 'number') {
              draft.lastSaved = new Date(draft.lastSaved);
            }
            if (draft.lastSaved instanceof Date && !isNaN(draft.lastSaved.getTime())) {
              setDraftData(draft);
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

  const renderMethodCard = (method: CreationMethodOption) => (
    <div
      key={method.id}
      onClick={() => handleMethodSelect(method.id)}
      className={cn(
        "group relative cursor-pointer transition-all duration-200",
        "border-2 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1",
        "bg-white"
      )}
      style={{
        borderColor: method.theme.border,
        ['--hover-border' as any]: method.theme.primary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = method.theme.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = method.theme.border;
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: method.theme.background }}
          >
            <method.icon 
              className="h-6 w-6" 
              style={{ color: method.theme.primary }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{method.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="text-sm font-medium"
                style={{ color: method.theme.primary }}
              >
                {method.subtitle}
              </span>
              {method.recommended && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 border border-amber-200">
                  <Crown className="h-3 w-3 text-amber-600" />
                  <span className="text-xs font-medium text-amber-800">Recommended</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {method.timeEstimate}
          </div>
          <div className="mt-1 px-2 py-1 rounded-md bg-gray-100 text-xs font-medium">
            {method.complexity}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{method.description}</p>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {method.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700">Choose this method</span>
        <div 
          className="p-2 rounded-lg group-hover:scale-110 transition-transform"
          style={{ backgroundColor: method.theme.background }}
        >
          <ArrowLeft 
            className="h-4 w-4 rotate-180" 
            style={{ color: method.theme.primary }}
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    const theme = getCurrentTheme();
    
    switch (currentMethod) {
      case 'selection':
        return (
          <div className="h-full flex flex-col">
            {/* Header Section - Fixed */}
            <div className="flex-shrink-0 text-center py-6 px-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Character</h2>
              <p className="text-gray-600">Choose how you'd like to create your character</p>
            </div>

            {/* Draft Recovery - Fixed */}
            {draftData && (
              <div className="flex-shrink-0 mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Save className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-blue-900">Continue Previous Work</h4>
                    <p className="text-sm text-blue-700 mt-1">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Continue ({Math.round(draftData.progress || 0)}% complete)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearDraft}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
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
            theme={theme}
          />
        );

      case 'templates':
        return (
          <CharacterTemplatesUnified
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
            theme={theme}
          />
        );

      case 'ai':
        return (
          <CharacterAICreationUnified
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
            theme={theme}
          />
        );

      case 'upload':
        return (
          <CharacterDocumentUploadUnified
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
            theme={theme}
          />
        );

      default:
        return null;
    }
  };

  const currentMethodInfo = CREATION_METHODS.find(m => m.id === currentMethod);
  const theme = getCurrentTheme();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden bg-white"
        hideCloseButton
      >
        {/* UNIFIED HEADER - SINGLE EXIT POINT */}
        <div 
          className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b"
          style={{ 
            backgroundColor: currentMethod !== 'selection' ? theme.background : '#F8FAFC',
            borderBottomColor: currentMethod !== 'selection' ? theme.border : '#E2E8F0'
          }}
        >
          <div className="flex items-center gap-4">
            {currentMethod !== 'selection' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="gap-2 hover:bg-white/50"
                  style={{ color: theme.primary }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="h-6 w-px bg-gray-200" />
              </>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentMethod === 'selection' 
                  ? 'Character Creator' 
                  : currentMethodInfo?.title || 'Character Creator'
                }
              </h1>
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
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
            className="rounded-full hover:bg-gray-100 flex-shrink-0"
          >
            <X className="h-5 w-5 text-gray-500" />
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