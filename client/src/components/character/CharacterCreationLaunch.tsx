import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles, FileText, User, Zap, Wand2, Brain, Upload } from 'lucide-react';

interface CharacterCreationLaunchProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onOpenTemplates: () => void;
  onOpenAIGeneration: () => void;
  onOpenDocumentUpload: () => void;
}

export function CharacterCreationLaunch({
  isOpen,
  onClose,
  onCreateBlank,
  onOpenTemplates,
  onOpenAIGeneration,
  onOpenDocumentUpload
}: CharacterCreationLaunchProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const creationOptions = [
    {
      id: 'blank',
      title: 'Start from Scratch',
      description: 'Create a character completely from your imagination',
      icon: Plus,
      action: onCreateBlank,
      features: ['Complete creative control', 'Build step by step', 'Perfect for unique concepts'],
      color: 'from-accent/10 to-accent/5',
      iconColor: 'text-accent'
    },
    {
      id: 'template',
      title: 'AI-Enhanced Templates',
      description: 'Choose from 20+ professional archetypes with AI expansion',
      icon: FileText,
      action: onOpenTemplates,
      features: ['20+ comprehensive archetypes', 'AI expands template foundations', 'Full character generation included'],
      color: 'from-accent/10 to-accent/5',
      iconColor: 'text-accent'
    },
    {
      id: 'ai',
      title: 'Custom AI Generation',
      description: 'Create completely unique characters with custom prompts',
      icon: Sparkles,
      action: onOpenAIGeneration,
      features: ['Custom prompts and parameters', 'Story-context awareness', 'Portrait generation included'],
      color: 'from-accent/10 to-accent/5',
      iconColor: 'text-accent'
    },
    {
      id: 'document',
      title: 'Import Character Sheet',
      description: 'Upload existing character documents and let AI parse them',
      icon: Upload,
      action: onOpenDocumentUpload,
      features: ['PDF, Word, Text file support', 'AI extracts all character data', 'Auto-populates all character fields'],
      color: 'from-accent/10 to-accent/5',
      iconColor: 'text-accent'
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

        <div className="py-4">
          <div className="grid grid-cols-2 gap-3">
            {creationOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl border border-border/50 hover:border-accent/50 bg-card/50 backdrop-blur-sm relative overflow-hidden ${
                    isSelected ? 'scale-[1.01] shadow-2xl border-accent/70 bg-accent/5' : ''
                  }`}
                  onClick={() => handleOptionSelect(option.id, option.action)}
                >
                  <CardContent className="p-3 relative h-full">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10 flex h-full">
                      {/* Left side - Icon */}
                      <div className="flex-shrink-0 mr-3">
                        <div className={`p-2 bg-gradient-to-br ${option.color} rounded-lg group-hover:scale-105 transition-transform duration-300`}>
                          <Icon className={`h-5 w-5 ${option.iconColor}`} />
                        </div>
                      </div>
                      
                      {/* Right side - Content */}
                      <div className="flex-1 flex flex-col">
                        <div className="mb-2">
                          <h3 className={`font-semibold text-sm mb-1 group-hover:${option.iconColor} transition-colors duration-200`}>
                            {option.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {option.description}
                          </p>
                        </div>
                        
                        {/* Features */}
                        <div className="space-y-1 flex-grow">
                          {option.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className={`w-1 h-1 ${option.iconColor.replace('text-', 'bg-')} rounded-full`} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Loading indicator */}
                        {isSelected && (
                          <div className={`mt-2 flex items-center gap-1 ${option.iconColor}`}>
                            <div className={`w-3 h-3 border-2 ${option.iconColor.replace('text-', 'border-')}/30 ${option.iconColor.replace('text-', 'border-t-')} rounded-full animate-spin`} />
                            <span className="text-xs font-medium">Starting...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom tip */}
          <div className="text-center mt-4 p-2 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Brain className="h-3 w-3 text-accent/60" />
              <span>
                <strong>Pro Tip:</strong> You can always enhance any character with AI assistance later
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}