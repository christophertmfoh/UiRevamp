import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles, FileText, User, Zap, Wand2, Brain } from 'lucide-react';

interface CharacterCreationLaunchProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onOpenTemplates: () => void;
  onOpenAIGeneration: () => void;
}

export function CharacterCreationLaunch({
  isOpen,
  onClose,
  onCreateBlank,
  onOpenTemplates,
  onOpenAIGeneration
}: CharacterCreationLaunchProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const creationOptions = [
    {
      id: 'blank',
      title: 'Start from Scratch',
      description: 'Create a character completely from your imagination',
      icon: Plus,
      action: onCreateBlank,
      features: ['Complete creative control', 'Build step by step', 'Perfect for unique concepts']
    },
    {
      id: 'template',
      title: 'AI-Enhanced Templates',
      description: 'Choose from 20+ professional archetypes with AI expansion',
      icon: FileText,
      action: onOpenTemplates,
      features: ['20+ comprehensive archetypes', 'AI expands template foundations', 'Full character generation included']
    },
    {
      id: 'ai',
      title: 'Custom AI Generation',
      description: 'Create completely unique characters with custom prompts',
      icon: Sparkles,
      action: onOpenAIGeneration,
      features: ['Custom prompts and parameters', 'Story-context awareness', 'Portrait generation included']
    }
  ];

  const handleOptionSelect = (optionId: string, action: () => void) => {
    setSelectedOption(optionId);
    setTimeout(() => {
      action();
      onClose();
      setSelectedOption('');
    }, 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6 border-b border-border/30">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl">
              <User className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="font-bold">Create New Character</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                Choose how you'd like to bring your character to life
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {creationOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-border/50 hover:border-accent/50 bg-card/50 backdrop-blur-sm relative overflow-hidden ${
                    isSelected ? 'scale-[1.02] shadow-xl border-accent/70 bg-accent/5' : ''
                  }`}
                  onClick={() => handleOptionSelect(option.id, option.action)}
                >
                  <CardContent className="p-8 relative h-full flex flex-col text-center">
                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-accent/20 group-hover:scale-110">
                        <Icon className="h-8 w-8 text-accent" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative space-y-4 flex-1">
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-accent transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 pt-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 bg-accent/60 rounded-full" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Loading indicator */}
                      {isSelected && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-accent">
                          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                          <span className="text-sm font-medium">Creating...</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom tip */}
          <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4 text-accent/60" />
              <span>
                <strong>Pro Tip:</strong> You can always enhance any character with AI assistance later through the character editor
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}