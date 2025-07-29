import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Sparkles, FileText, Upload, Pencil,
  ArrowLeft, X
} from 'lucide-react';
import { CharacterGuidedCreationV4 } from './CharacterGuidedCreationV4';
import { CharacterTemplatesV4 } from './CharacterTemplatesV4';
import { CharacterAICreationV4 } from './CharacterAICreationV4';
import { CharacterDocumentUploadV4 } from './CharacterDocumentUploadV4';
import type { Character } from '@/lib/types';

interface CharacterCreationWizardV4Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onComplete?: (character: Character) => void;
}

type CreationMethod = 'selection' | 'guided' | 'templates' | 'ai' | 'upload';

const CharacterCreationWizardV4: React.FC<CharacterCreationWizardV4Props> = ({
  isOpen,
  onClose,
  projectId,
  onComplete
}) => {
  const [currentMethod, setCurrentMethod] = useState<CreationMethod>('selection');

  const handleBack = () => {
    setCurrentMethod('selection');
  };

  const handleComplete = (character: Character) => {
    onComplete?.(character);
    onClose();
  };

  const renderContent = () => {
    switch (currentMethod) {
      case 'selection':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-semibold">Create New Character</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose how you'd like to create your character
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Options */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {/* Guided Creation */}
                <button
                  onClick={() => setCurrentMethod('guided')}
                  className={cn(
                    "relative group text-left p-6 rounded-xl border-2 transition-all",
                    "hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1",
                    "bg-gradient-to-br from-blue-500/5 to-transparent"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                      <Pencil className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Build Your Own</h3>
                      <p className="text-sm text-muted-foreground">
                        Build your own custom character
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Detailed</span>
                        <span>•</span>
                        <span>15-20 min</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* AI Templates */}
                <button
                  onClick={() => setCurrentMethod('templates')}
                  className={cn(
                    "relative group text-left p-6 rounded-xl border-2 transition-all",
                    "hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1",
                    "bg-gradient-to-br from-emerald-500/5 to-transparent"
                  )}
                >
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">AI Templates</h3>
                      <p className="text-sm text-muted-foreground">
                        Start with a template, AI expands it
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Quick</span>
                        <span>•</span>
                        <span>2-5 min</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Custom AI */}
                <button
                  onClick={() => setCurrentMethod('ai')}
                  className={cn(
                    "relative group text-left p-6 rounded-xl border-2 transition-all",
                    "hover:border-purple-500/50 hover:shadow-lg hover:-translate-y-1",
                    "bg-gradient-to-br from-purple-500/5 to-transparent"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Custom AI</h3>
                      <p className="text-sm text-muted-foreground">
                        Describe your character, AI creates it
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Instant</span>
                        <span>•</span>
                        <span>1-2 min</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Document Upload */}
                <button
                  onClick={() => setCurrentMethod('upload')}
                  className={cn(
                    "relative group text-left p-6 rounded-xl border-2 transition-all",
                    "hover:border-orange-500/50 hover:shadow-lg hover:-translate-y-1",
                    "bg-gradient-to-br from-orange-500/5 to-transparent"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Import Document</h3>
                      <p className="text-sm text-muted-foreground">
                        Extract character from existing text
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Smart</span>
                        <span>•</span>
                        <span>2-3 min</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'guided':
        return (
          <CharacterGuidedCreationV4
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
            onClose={onClose}
          />
        );

      case 'templates':
        return (
          <CharacterTemplatesV4
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
            onClose={onClose}
          />
        );

      case 'ai':
        return (
          <CharacterAICreationV4
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
            onClose={onClose}
          />
        );

      case 'upload':
        return (
          <CharacterDocumentUploadV4
            projectId={projectId}
            onBack={handleBack}
            onComplete={handleComplete}
            onClose={onClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CharacterCreationWizardV4;