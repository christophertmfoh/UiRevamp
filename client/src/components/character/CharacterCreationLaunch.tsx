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
      gradient: 'from-accent/20 to-accent/10',
      borderColor: 'border-accent/30',
      hoverColor: 'hover:border-accent/50',
      action: onCreateBlank,
      features: ['Complete creative control', 'Build step by step', 'Perfect for unique concepts']
    },
    {
      id: 'template',
      title: 'Use Professional Template',
      description: 'Start with proven character archetypes and storytelling patterns',
      icon: FileText,
      gradient: 'from-accent/25 to-accent/15',
      borderColor: 'border-accent/40',
      hoverColor: 'hover:border-accent/60',
      action: onOpenTemplates,
      features: ['6 story-tested archetypes', 'Pre-filled character fields', 'Industry best practices']
    },
    {
      id: 'ai',
      title: 'AI-Powered Creation',
      description: 'Let AI generate a complete character based on your story needs',
      icon: Sparkles,
      gradient: 'from-accent/30 to-accent/20',
      borderColor: 'border-accent/50',
      hoverColor: 'hover:border-accent/70',
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
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 ${option.borderColor} ${option.hoverColor} bg-gradient-to-br ${option.gradient} relative overflow-hidden ${
                    isSelected ? 'scale-[1.02] shadow-xl border-accent/60' : ''
                  }`}
                  onClick={() => handleOptionSelect(option.id, option.action)}
                >
                  <CardContent className="p-6 relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Icon */}
                    <div className="relative mb-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent/30 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Icon className="h-8 w-8 text-accent-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative text-center space-y-4">
                      <div>
                        <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-accent/60 rounded-full" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action button */}
                      <Button 
                        className="w-full bg-accent/90 hover:bg-accent text-accent-foreground shadow-lg group-hover:shadow-xl transition-all duration-200 mt-4"
                        disabled={isSelected}
                      >
                        {isSelected ? (
                          <>
                            <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Icon className="h-4 w-4 mr-2" />
                            Choose This
                          </>
                        )}
                      </Button>
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