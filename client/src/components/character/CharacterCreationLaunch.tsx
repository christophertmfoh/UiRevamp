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
                  className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-accent/60 bg-gradient-to-br from-amber-50/10 via-orange-50/10 to-yellow-50/5 backdrop-blur-sm relative overflow-hidden ${
                    isSelected ? 'scale-105 shadow-2xl border-accent/80' : ''
                  }`}
                  onClick={() => handleOptionSelect(option.id, option.action)}
                >
                  <CardContent className="p-6 relative h-full flex flex-col">
                    {/* Warm glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-amber-300/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    
                    {/* Icon */}
                    <div className="relative mb-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500/20 to-orange-400/15 rounded-2xl flex items-center justify-center transition-transform duration-300 shadow-lg border border-amber-400/20">
                        <Icon className="h-8 w-8 text-amber-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative text-center space-y-4 flex-1 flex flex-col">
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-foreground">
                          {option.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 flex-1">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-amber-500/70 rounded-full" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action button - always at bottom */}
                      <div className="mt-6">
                        <Button 
                          className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                          disabled={isSelected}
                        >
                          {isSelected ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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