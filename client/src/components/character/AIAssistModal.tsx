import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, User, Eye, Brain, Zap, BookOpen, Users } from 'lucide-react';

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssist: (categories: string[]) => void;
  isProcessing?: boolean;
}

const CATEGORIES = [
  { id: 'identity', label: 'Identity', icon: User, description: 'Name, race, class, profession, titles' },
  { id: 'physical', label: 'Physical', icon: Eye, description: 'Appearance, height, build, distinguishing features' },
  { id: 'personality', label: 'Personality', icon: Brain, description: 'Traits, quirks, values, beliefs, goals' },
  { id: 'skills', label: 'Skills', icon: Zap, description: 'Abilities, talents, strengths, weaknesses' },
  { id: 'background', label: 'Background', icon: BookOpen, description: 'Backstory, childhood, education, past events' },
  { id: 'story', label: 'Story', icon: Users, description: 'Motivations, fears, secrets, character arcs' }
];

export function AIAssistModal({ isOpen, onClose, onStartAssist, isProcessing = false }: AIAssistModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleStart = () => {
    onStartAssist(selectedCategories);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Character Enhancement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Select which character aspects you'd like AI to enhance. Empty fields will be filled with contextual, 
            detailed information based on your character's existing traits.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategories.includes(category.id);
              
              return (
                <div
                  key={category.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4 text-accent" />
                        <h3 className="font-medium">{category.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleStart} 
              disabled={selectedCategories.length === 0 || isProcessing}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Enhance {selectedCategories.length} Categories
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}