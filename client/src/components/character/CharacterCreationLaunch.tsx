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
      title: 'Use Professional Template',
      description: 'Start with proven character archetypes and storytelling patterns',
      icon: FileText,
      action: onOpenTemplates,
      features: ['6 story-tested archetypes', 'Pre-filled character fields', 'Industry best practices']
    },
    {
      id: 'ai',
      title: 'AI-Powered Creation',
      description: 'Let AI generate a complete character based on your story needs',
      icon: Sparkles,
      action: onOpenAIGeneration,
      features: ['Context-aware generation', 'Instant backstory creation', 'Portrait generation included']
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
                  className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-accent bg-gradient-to-br from-accent via-accent/90 to-accent/80 backdrop-blur-sm relative overflow-hidden ${
                    isSelected ? 'scale-105 shadow-2xl border-accent' : ''
                  }`}
                  onClick={() => handleOptionSelect(option.id, option.action)}
                >
                  <CardContent className="p-6 relative h-full flex flex-col">
                    {/* Warm glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent-foreground/20 to-accent-foreground/10 rounded-2xl flex items-center justify-center transition-transform duration-300 shadow-lg border border-accent-foreground/30">
                        <Icon className="h-10 w-10 text-accent-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative text-center space-y-4 flex-1">
                      <div>
                        <h3 className="font-bold text-xl mb-3 text-accent-foreground">
                          {option.title}
                        </h3>
                        <p className="text-accent-foreground/80 text-sm leading-relaxed mb-4">
                          {option.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-accent-foreground/70">
                            <div className="w-1.5 h-1.5 bg-accent-foreground/60 rounded-full" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Loading indicator */}
                      {isSelected && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-accent-foreground/70">
                          <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                          <span className="text-sm">Loading...</span>
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