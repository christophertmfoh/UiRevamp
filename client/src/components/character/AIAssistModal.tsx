import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Zap, User, Eye, BookOpen, Users, PenTool, X } from 'lucide-react';

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssist: (selectedCategories: string[]) => void;
  isProcessing: boolean;
}

const AI_CATEGORIES = [
  {
    id: 'identity',
    name: 'Identity',
    icon: User,
    description: 'Basic character info like name, age, race, profession, and background details',
    fields: 16,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'physical',
    name: 'Physical',
    icon: Eye,
    description: 'Appearance details including height, build, facial features, clothing style',
    fields: 26,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'personality',
    name: 'Personality',
    icon: Brain,
    description: 'Character traits, temperament, beliefs, values, likes, dislikes, and habits',
    fields: 20,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'psychology',
    name: 'Psychology',
    icon: Zap,
    description: 'Deep psychological aspects like fears, desires, trauma, coping mechanisms',
    fields: 24,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'background',
    name: 'Background',
    icon: BookOpen,
    description: 'Character history, upbringing, education, formative events, achievements',
    fields: 14,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'relationships',
    name: 'Relationships',
    icon: Users,
    description: 'Family, friends, enemies, allies, romantic history, social connections',
    fields: 13,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'abilities',
    name: 'Abilities',
    icon: PenTool,
    description: 'Skills, talents, strengths, expertise, magical abilities, combat skills',
    fields: 17,
    color: 'from-indigo-500 to-indigo-600'
  }
];

export function AIAssistModal({ isOpen, onClose, onStartAssist, isProcessing }: AIAssistModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(AI_CATEGORIES.map(cat => cat.id));

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories(AI_CATEGORIES.map(cat => cat.id));
  };

  const handleSelectNone = () => {
    setSelectedCategories([]);
  };

  const handleStartAssist = () => {
    if (selectedCategories.length > 0) {
      onStartAssist(selectedCategories);
    }
  };

  const totalFields = AI_CATEGORIES
    .filter(cat => selectedCategories.includes(cat.id))
    .reduce((sum, cat) => sum + cat.fields, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">AI Character Assistant</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Let AI help develop your character with smart, contextual details</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* How it Works */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">How AI Assist Works</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2" />
                <p><strong className="text-foreground">Smart Analysis:</strong> AI reads your existing character data to understand context</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2" />
                <p><strong className="text-foreground">Contextual Generation:</strong> Creates details that fit your character's personality and background</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2" />
                <p><strong className="text-foreground">Category Processing:</strong> Works through selected categories systematically</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2" />
                <p><strong className="text-foreground">Non-Destructive:</strong> Only fills empty fields, never overwrites your existing content</p>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Select Categories to Enhance</h3>
              <div className="flex gap-2">
                <Button onClick={handleSelectAll} variant="outline" size="sm">Select All</Button>
                <Button onClick={handleSelectNone} variant="outline" size="sm">Clear All</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {AI_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategories.includes(category.id);
                
                return (
                  <div key={category.id} className="relative">
                    <div 
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'border-accent bg-accent/5 shadow-sm' 
                          : 'border-border/30 hover:border-accent/50 hover:bg-accent/5'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        
                        <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-accent-foreground" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{category.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {category.fields} fields
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {selectedCategories.length > 0 && (
            <div className="bg-background border border-border/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    AI will analyze and enhance up to {totalFields} character fields
                  </p>
                </div>
                <Badge className="bg-accent/10 text-accent border-accent/30">
                  ~{Math.ceil(totalFields / 10)} minutes
                </Badge>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleStartAssist}
              disabled={selectedCategories.length === 0 || isProcessing}
              className="flex-1 gap-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
            >
              <Sparkles className="w-4 h-4" />
              {isProcessing ? 'AI Working...' : `Assist Me (${selectedCategories.length} categories)`}
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}